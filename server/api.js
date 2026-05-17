// Simple HTTP API for beta signups and leaderboard
import { createServer } from 'http';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'us-east-1' });
const ddb = DynamoDBDocumentClient.from(client);

const SIGNUPS_TABLE = 'nettrek-beta-signups';
const LEADERBOARD_TABLE = 'nettrek-leaderboard';

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res, status, data) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
  });
}

export function startAPI(port = 4301, options = {}) {
  const maxPortAttempts = options.maxPortAttempts || 20;
  const reservedPorts = new Set(options.reservedPorts || []);
  let currentPort = port;

  const createAPIServer = () => createServer(async (req, res) => {
    // CORS preflight
    if (req.method === 'OPTIONS') { cors(res); res.writeHead(204); res.end(); return; }

    const url = new URL(req.url, `http://localhost:${port}`);

    // POST /signup — beta email signup
    if (req.method === 'POST' && url.pathname === '/signup') {
      const body = await parseBody(req);
      const email = (body.email || '').trim().toLowerCase();
      if (!email || !email.includes('@')) {
        return json(res, 400, { error: 'Invalid email' });
      }
      try {
        await ddb.send(new PutCommand({
          TableName: SIGNUPS_TABLE,
          Item: { email, signedUpAt: new Date().toISOString(), source: 'game-client' },
          ConditionExpression: 'attribute_not_exists(email)',
        }));
        return json(res, 200, { ok: true, message: 'Signed up for beta!' });
      } catch (e) {
        if (e.name === 'ConditionalCheckFailedException') {
          return json(res, 200, { ok: true, message: 'Already signed up!' });
        }
        console.error('[API] Signup error:', e.message);
        return json(res, 500, { error: 'Server error' });
      }
    }

    // GET /leaderboard — top 20 players
    if (req.method === 'GET' && url.pathname === '/leaderboard') {
      try {
        const result = await ddb.send(new ScanCommand({ TableName: LEADERBOARD_TABLE, Limit: 50 }));
        const items = (result.Items || [])
          .sort((a, b) => (b.kills || 0) - (a.kills || 0))
          .slice(0, 20);
        return json(res, 200, { leaderboard: items });
      } catch (e) {
        console.error('[API] Leaderboard error:', e.message);
        return json(res, 200, { leaderboard: [] });
      }
    }

    // POST /score — update player score
    if (req.method === 'POST' && url.pathname === '/score') {
      const body = await parseBody(req);
      const { name, kills, deaths, planetsTaken, armiesBombed, faction, shipClass } = body;
      if (!name) return json(res, 400, { error: 'Name required' });
      try {
        await ddb.send(new UpdateCommand({
          TableName: LEADERBOARD_TABLE,
          Key: { name },
          UpdateExpression: 'SET kills = if_not_exists(kills, :zero) + :k, deaths = if_not_exists(deaths, :zero) + :d, planetsTaken = if_not_exists(planetsTaken, :zero) + :p, armiesBombed = if_not_exists(armiesBombed, :zero) + :a, faction = :f, shipClass = :sc, lastSeen = :ts',
          ExpressionAttributeValues: {
            ':k': kills || 0, ':d': deaths || 0, ':p': planetsTaken || 0, ':a': armiesBombed || 0,
            ':f': faction || 'federation', ':sc': shipClass || 'destroyer',
            ':ts': new Date().toISOString(), ':zero': 0,
          },
        }));
        return json(res, 200, { ok: true });
      } catch (e) {
        console.error('[API] Score error:', e.message);
        return json(res, 500, { error: 'Server error' });
      }
    }

    json(res, 404, { error: 'Not found' });
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
