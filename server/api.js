// Simple HTTP API for beta signups and leaderboard
import { createServer } from 'http';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(client);

const SIGNUPS_TABLE = 'nettrek-beta-signups';
const LEADERBOARD_TABLE = 'nettrek-leaderboard';

// Trust boundary constants — keep the public API stingy.
const MAX_BODY_BYTES = 4 * 1024;                                 // 4 KB request cap
const MAX_NAME_LEN = 24;
const MAX_EMAIL_LEN = 254;
const MAX_SCORE_DELTA = 10_000;                                  // per-call score increment cap
const VALID_FACTIONS = new Set(['federation', 'klingon', 'romulan', 'orion']);
const VALID_SHIP_CLASSES = new Set(['scout', 'destroyer', 'cruiser', 'battleship', 'assault']);
// CORS allowlist. Configure via NETTREK_ALLOWED_ORIGINS env var (comma-sep).
// Falls back to known prod + localhost dev. '*' is intentionally NOT allowed
// for the API — was the old behavior and let any site poison the leaderboard.
const ALLOWED_ORIGINS = new Set(
  (process.env.NETTREK_ALLOWED_ORIGINS || 'https://d2pu3pmby1pmk.cloudfront.net,http://localhost:5173,http://localhost:4173')
    .split(',').map(s => s.trim()).filter(Boolean)
);

function cors(res, origin) {
  // Echo back the origin only if it's on the allowlist — otherwise omit
  // the header so the browser blocks the response.
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res, status, data, origin) {
  cors(res, origin);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    let aborted = false;
    req.on('data', c => {
      if (aborted) return;
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        aborted = true;
        const err = new Error('Body too large');
        err.statusCode = 413;
        req.destroy();
        reject(err);
        return;
      }
      body += c;
    });
    req.on('end', () => {
      if (aborted) return;
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
    req.on('error', () => { if (!aborted) resolve({}); });
  });
}

function clampInt(v, lo, hi) {
  const n = Number(v);
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.floor(n)));
}

// Strip control chars, cap length, collapse whitespace.
function sanitizeName(v) {
  if (typeof v !== 'string') return '';
  return v.replace(/[\x00-\x1f\x7f]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_NAME_LEN);
}

export function startAPI(port = 4301, options = {}) {
  const maxPortAttempts = options.maxPortAttempts || 20;
  const reservedPorts = new Set(options.reservedPorts || []);
  let currentPort = port;

  const createAPIServer = () => createServer(async (req, res) => {
    const origin = req.headers.origin;

    // CORS preflight
    if (req.method === 'OPTIONS') { cors(res, origin); res.writeHead(204); res.end(); return; }

    const url = new URL(req.url, `http://localhost:${port}`);

    // Safe body parse with size cap — rejects bodies over MAX_BODY_BYTES
    let body = {};
    if (req.method === 'POST') {
      try { body = await parseBody(req); }
      catch (e) {
        return json(res, e.statusCode || 400, { error: 'Bad request' }, origin);
      }
    }

    // POST /signup — beta email signup
    if (req.method === 'POST' && url.pathname === '/signup') {
      const raw = typeof body.email === 'string' ? body.email : '';
      const email = raw.trim().toLowerCase().slice(0, MAX_EMAIL_LEN);
      if (!email || !email.includes('@') || email.length < 5) {
        return json(res, 400, { error: 'Invalid email' }, origin);
      }
      try {
        await ddb.send(new PutCommand({
          TableName: SIGNUPS_TABLE,
          Item: { email, signedUpAt: new Date().toISOString(), source: 'game-client' },
          ConditionExpression: 'attribute_not_exists(email)',
        }));
        return json(res, 200, { ok: true, message: 'Signed up for beta!' }, origin);
      } catch (e) {
        if (e.name === 'ConditionalCheckFailedException') {
          return json(res, 200, { ok: true, message: 'Already signed up!' }, origin);
        }
        console.error('[API] Signup error:', e.message);
        return json(res, 500, { error: 'Server error' }, origin);
      }
    }

    // GET /leaderboard — top 20 players
    if (req.method === 'GET' && url.pathname === '/leaderboard') {
      try {
        const result = await ddb.send(new ScanCommand({ TableName: LEADERBOARD_TABLE, Limit: 50 }));
        const items = (result.Items || [])
          .sort((a, b) => (b.kills || 0) - (a.kills || 0))
          .slice(0, 20);
        return json(res, 200, { leaderboard: items }, origin);
      } catch (e) {
        console.error('[API] Leaderboard error:', e.message);
        return json(res, 200, { leaderboard: [] }, origin);
      }
    }

    // POST /score — update player score. Strict validation: every numeric
    // field is clamped to [0, MAX_SCORE_DELTA] per call, name is sanitized,
    // faction/shipClass are enum-checked. Previously the API trusted the
    // client and would happily store kills:1e9 / faction:"<script>" / etc.
    if (req.method === 'POST' && url.pathname === '/score') {
      const name = sanitizeName(body.name);
      if (!name) return json(res, 400, { error: 'Name required' }, origin);
      const faction = VALID_FACTIONS.has(body.faction) ? body.faction : 'federation';
      const shipClass = VALID_SHIP_CLASSES.has(body.shipClass) ? body.shipClass : 'destroyer';
      const kills = clampInt(body.kills, 0, MAX_SCORE_DELTA);
      const deaths = clampInt(body.deaths, 0, MAX_SCORE_DELTA);
      const planetsTaken = clampInt(body.planetsTaken, 0, MAX_SCORE_DELTA);
      const armiesBombed = clampInt(body.armiesBombed, 0, MAX_SCORE_DELTA);
      try {
        await ddb.send(new UpdateCommand({
          TableName: LEADERBOARD_TABLE,
          Key: { name },
          UpdateExpression: 'SET kills = if_not_exists(kills, :zero) + :k, deaths = if_not_exists(deaths, :zero) + :d, planetsTaken = if_not_exists(planetsTaken, :zero) + :p, armiesBombed = if_not_exists(armiesBombed, :zero) + :a, faction = :f, shipClass = :sc, lastSeen = :ts',
          ExpressionAttributeValues: {
            ':k': kills, ':d': deaths, ':p': planetsTaken, ':a': armiesBombed,
            ':f': faction, ':sc': shipClass,
            ':ts': new Date().toISOString(), ':zero': 0,
          },
        }));
        return json(res, 200, { ok: true }, origin);
      } catch (e) {
        console.error('[API] Score error:', e.message);
        return json(res, 500, { error: 'Server error' }, origin);
      }
    }

    json(res, 404, { error: 'Not found' }, origin);
  });

  return new Promise((resolve, reject) => {
    const tryListen = () => {
      while (reservedPorts.has(currentPort) && currentPort < port + maxPortAttempts) {
        console.warn(`[NetTrek] API port ${currentPort} is reserved, trying ${currentPort + 1}`);
        currentPort++;
      }

      const server = createAPIServer();

      server.once('error', (err) => {
        if (err.code === 'EADDRINUSE' && currentPort < port + maxPortAttempts) {
          console.warn(`[NetTrek] API port ${currentPort} is in use, trying ${currentPort + 1}`);
          currentPort++;
          tryListen();
          return;
        }
        reject(err);
      });

      server.listen(currentPort, () => {
        console.log(`[NetTrek] API listening on http://localhost:${currentPort}`);
        resolve({ server, port: currentPort });
      });
    };

    tryListen();
  });
}
