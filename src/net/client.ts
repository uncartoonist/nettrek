// Multiplayer network client — connects to WebSocket game server

import type { Faction, ShipClass, GameState, Ship, Torpedo, Phaser, Explosion, KillFeedEntry, Vec2 } from '../core/types';
import { SHIP_CLASS_STATS, GALAXY_SIZE } from '../core/types';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

export interface ServerShip {
  id: number; name: string; faction: Faction; shipClass: ShipClass;
  x: number; y: number; heading: number; speed: number;
  shields: number; hull: number; energy: number;
  cloaked: boolean; alive: boolean; armies: number; orbiting: number;
  kills: number; deaths: number; planetsTaken: number;
}

export interface ClientInput {
  thrust: boolean;
  brake: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  fireTorp: boolean;
  firePhaser: boolean;
  cloak: boolean;
  bomb: boolean;
  beamDown: boolean;
  beamUp: boolean;
}

export class NetClient {
  private ws: WebSocket | null = null;
  private _state: ConnectionState = 'disconnected';
  private _playerId: number = -1;
  private _latency: number = 0;
  private pingInterval: number | null = null;
  private onStateUpdate: ((data: any) => void) | null = null;
  private onChatMessage: ((msg: any) => void) | null = null;
  private onWelcome: ((data: any) => void) | null = null;

  get state() { return this._state; }
  get playerId() { return this._playerId; }
  get latency() { return this._latency; }

  connect(url: string, handlers: {
    onState: (data: any) => void;
    onChat: (msg: any) => void;
    onWelcome: (data: any) => void;
    onDisconnect: () => void;
  }): void {
    const previousSocket = this.ws;
    this.cleanupSocket();
    previousSocket?.close();
    this.onStateUpdate = handlers.onState;
    this.onChatMessage = handlers.onChat;
    this.onWelcome = handlers.onWelcome;

    this._state = 'connecting';
    let socket: WebSocket;
    try {
      socket = new WebSocket(url);
    } catch {
      this._state = 'disconnected';
      handlers.onDisconnect();
      return;
    }
    this.ws = socket;

    socket.onopen = () => {
      if (this.ws !== socket) return;
      this._state = 'connected';
      // Start ping interval
      this.pingInterval = window.setInterval(() => {
        this.send({ type: 'ping', t: Date.now() });
      }, 2000);
    };

    socket.onmessage = (e) => {
      if (this.ws !== socket) return;
      try {
        const msg = JSON.parse(e.data);
        switch (msg.type) {
          case 'welcome':
            this._playerId = msg.id;
            this.onWelcome?.(msg);
            break;
          case 'state':
            this.onStateUpdate?.(msg);
            break;
          case 'chat':
            this.onChatMessage?.(msg);
            break;
          case 'pong':
            this._latency = Date.now() - msg.t;
            break;
        }
      } catch { /* ignore */ }
    };

    socket.onclose = () => {
      if (this.ws !== socket) return;
      this.cleanupSocket();
      this._state = 'disconnected';
      this._playerId = -1;
      handlers.onDisconnect();
    };

    socket.onerror = () => {
      if (this.ws !== socket) return;
      this._state = 'disconnected';
      socket.close();
    };
  }

  spawn(faction: Faction, shipClass: ShipClass, name: string): void {
    this.send({ type: 'spawn', faction, shipClass, name });
  }

  sendInput(input: ClientInput): void {
    this.send({ type: 'input', input });
  }

  sendChat(text: string, team: boolean): void {
    this.send({ type: 'chat', text, team });
  }

  disconnect(): void {
    const socket = this.ws;
    this.cleanupSocket();
    socket?.close();
    this._state = 'disconnected';
    this._playerId = -1;
  }

  private send(msg: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  private cleanupSocket(): void {
    if (this.pingInterval !== null) {
      window.clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      this.ws = null;
    }
  }
}

// Apply server state to local GameState (for rendering)
export function applyServerState(state: GameState, data: any, myId: number): void {
  const ships = Array.isArray(data?.ships) ? data.ships : [];
  const torpedoes = Array.isArray(data?.torpedoes) ? data.torpedoes : [];
  const phasers = Array.isArray(data?.phasers) ? data.phasers : [];
  const explosions = Array.isArray(data?.explosions) ? data.explosions : [];
  const killFeed = Array.isArray(data?.killFeed) ? data.killFeed : [];
  const planets = Array.isArray(data?.planets) ? data.planets : [];

  // Update ships
  state.ships = ships.map((s: ServerShip): Ship => ({
    id: s.id,
    name: s.name,
    faction: s.faction,
    shipClass: s.shipClass,
    pos: { x: s.x, y: s.y },
    vel: { x: Math.cos(s.heading) * s.speed, y: Math.sin(s.heading) * s.speed },
    heading: s.heading,
    speed: s.speed,
    shields: s.shields,
    hull: s.hull,
    energy: s.energy,
    cloaked: s.cloaked,
    alive: s.alive,
    armies: s.armies,
    orbiting: s.orbiting,
    respawnTimer: 0,
    kills: s.kills,
    deaths: s.deaths,
    planetsTaken: s.planetsTaken,
    armiesBombed: 0,
  }));

  // Find player
  const me = state.ships.find(s => s.id === myId);
  if (me) state.player = me;

  // Torpedoes
  state.torpedoes = torpedoes.map((t: any): Torpedo => ({
    id: t.id, owner: 0, faction: t.faction,
    pos: { x: t.x, y: t.y },
    vel: { x: t.vx, y: t.vy },
    fuse: 30, alive: true, damage: 0,
  }));

  // Phasers
  state.phasers = phasers.map((p: any): Phaser => ({
    owner: 0, faction: p.faction,
    from: { x: p.fx, y: p.fy },
    to: { x: p.tx, y: p.ty },
    ttl: p.ttl * 3, damage: 0,
  }));

  // Explosions
  state.explosions = explosions.map((e: any): Explosion => ({
    pos: { x: e.x, y: e.y },
    ttl: e.ttl * 3,
    maxTtl: 45,
    particles: Array.from({ length: 15 }, () => ({
      dx: (Math.random() - 0.5) * 5,
      dy: (Math.random() - 0.5) * 5,
      life: 20 + Math.random() * 20,
    })),
  }));

  // Kill feed
  state.killFeed = killFeed.map((e: any): KillFeedEntry => ({
    killer: e.killer, killerFaction: e.killerFaction,
    victim: e.victim, victimFaction: e.victimFaction,
    ttl: e.ttl * 3,
  }));

  // Planet ownership updates (positions are fixed)
  for (const pd of planets) {
    const planet = state.planets.find(p => p.id === pd.id);
    if (planet) { planet.owner = pd.owner; planet.armies = pd.armies; }
  }

  // Camera
  if (me) {
    state.camera.x += (me.pos.x - state.camera.x) * 0.1;
    state.camera.y += (me.pos.y - state.camera.y) * 0.1;
  }
}
