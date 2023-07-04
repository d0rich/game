import { RemoteController } from './RemoteController';
import { RemoteDispatcher } from './RemoteDispatcher';
import { Character } from '../entities';
import { Position } from '../physics';

export class RemoteClient {
  id: string;
  private ws = new WebSocket(
    import.meta.env.PROD
      ? 'wss://d0rich-game-server.onrender.com'
      : 'ws://localhost:8080'
  );
  private main: Character;
  private players = new Map<string, Character>();
  private spawnPlayer: (position: Position) => Character;

  constructor(
    main: Character,
    options: {
      spawnPlayer: (position: Position) => Character;
    }
  ) {
    this.main = main;
    this.id = Number(new Date()).toString();
    this.spawnPlayer = options.spawnPlayer;
    this.players.set(this.id, main);
    const controller = main.getController();
    if (controller) {
      new RemoteDispatcher(this.id, controller, this.ws);
    }
    this.initRemotePositionUpdate(this.id);
    this.setupWsListeners();
  }

  initRemotePositionUpdate(id: string) {
    setInterval(() => {
      const player = this.players.get(id);
      if (!player) {
        return;
      }
      if (this.ws.readyState !== WebSocket.OPEN) {
        return;
      }
      this.ws.send(
        `player:coords:${id}:${player.position.x}:${player.position.y}`
      );
    }, 1000);
  }

  connectRemotePlayer(
    playerId: string,
    position: Position = new Position(320, 100)
  ) {
    const character = this.spawnPlayer(position);
    character.setController(new RemoteController(playerId, this.ws));
    this.players.set(playerId, character);
    this.initRemotePositionUpdate(playerId);
  }

  private setupWsListeners() {
    // On start
    this.ws.addEventListener('open', () => {
      this.ws.send(`player:new:${this.id}`);
    });
    // On message
    this.ws.addEventListener('message', (event) => {
      const message = event.data;
      const action = message.toString();
      if (action.startsWith(`player:new:`)) {
        this.ws.send(
          `player:coords:${this.id}:${this.main.position.x}:${this.main.position.y}`
        );
        const playerId = action.replace(`player:new:`, '');
        if (playerId === this.id) {
          return;
        }
        this.connectRemotePlayer(playerId);
      } else if (action.startsWith(`player:coords:`)) {
        const [playerId, x, y] = action
          .replace(`player:coords:`, '')
          .split(':');
        if (playerId === this.id) {
          return;
        }
        const player = this.players.get(playerId);
        const position = new Position(Number(x), Number(y));
        if (player) {
          player.setPosition(position);
        } else {
          this.connectRemotePlayer(playerId, position);
        }
      } else if (action.startsWith(`player:leave:`)) {
        const playerId = action.replace(`player:leave:`, '');
        const player = this.players.get(playerId);
        if (player) {
          player.takeDamage(999999999);
          this.players.delete(playerId);
        }
      }
    });
    // On close
    this.ws.addEventListener('close', () => {
      this.ws.send(`player:leave:${this.id}`);
    });
    window.addEventListener('beforeunload', () => {
      this.ws.send(`player:leave:${this.id}`);
      this.ws.close();
    });
  }
}
