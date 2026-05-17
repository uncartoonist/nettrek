import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { GameServer } from './game-server.js';
import { startAPI } from './api.js';

const PORT = parsePort(process.env.PORT, 4300);
const API_PORT = parsePort(process.env.API_PORT, 4301);
const MAX_PORT_ATTEMPTS = 20;
const wsServer = createServer();
const wss = new WebSocketServer({ noServer: true });
const game = new GameServer();
let tickTimer = null;
let broadcastTimer = null;

wsServer.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws) => {
  const playerId = game.addPlayer(ws);
  console.log(`[NetTrek] Player ${playerId} connected (${game.playerCount} online)`);

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      game.handleMessage(playerId, msg);
    } catch (e) { /* ignore malformed */ }
  });

  ws.on('close', () => {
    game.removePlayer(playerId);
    console.log(`[NetTrek] Player ${playerId} disconnected (${game.playerCount} online)`);
  });
});

function parsePort(value, fallback) {
  const port = parseInt(value || '', 10);
  return Number.isInteger(port) && port > 0 ? port : fallback;
}

function listenWithFallback(server, requestedPort, label, reservedPorts = []) {
  let port = requestedPort;
  const reserved = new Set(reservedPorts);

  return new Promise((resolve, reject) => {
    const tryListen = () => {
      while (reserved.has(port) && port < requestedPort + MAX_PORT_ATTEMPTS) {
        console.warn(`[NetTrek] ${label} port ${port} is reserved, trying ${port + 1}`);
        port++;
      }

      const onError = (err) => {
        server.off('listening', onListening);
        if (err.code === 'EADDRINUSE' && port < requestedPort + MAX_PORT_ATTEMPTS) {
          console.warn(`[NetTrek] ${label} port ${port} is in use, trying ${port + 1}`);
          port++;
          tryListen();
          return;
        }
        reject(err);
      };

      const onListening = () => {
        server.off('error', onError);
        resolve(port);
      };

      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(port);
    };

    tryListen();
  });
}

function startGameLoop() {
  // Game loop — 20 ticks/sec (server authoritative)
  const TICK_RATE = 20;
  tickTimer = setInterval(() => game.tick(), 1000 / TICK_RATE);

  // Broadcast state — 10 times/sec
  broadcastTimer = setInterval(() => game.broadcast(), 100);
}

async function main() {
  const port = await listenWithFallback(wsServer, PORT, 'WebSocket', [API_PORT]);
  console.log(`[NetTrek] Server listening on ws://localhost:${port}`);
  startGameLoop();

  // Start HTTP API (signups + leaderboard)
  await startAPI(API_PORT, { maxPortAttempts: MAX_PORT_ATTEMPTS, reservedPorts: [port] });
}

function shutdown() {
  if (tickTimer) clearInterval(tickTimer);
  if (broadcastTimer) clearInterval(broadcastTimer);
  wss.close();
  wsServer.close(() => process.exit(0));
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

main().catch((err) => {
  console.error('[NetTrek] Failed to start server:', err.message);
  process.exit(1);
});
