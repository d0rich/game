import { Application } from 'pixi.js';
import { Punk } from './characters/Punk';
import { Cyborg } from './characters/Cyborg';
import { Biker } from './characters/Biker';
import {
  LocalController,
  RemoteDispatcher,
  RemoteController,
} from 'engine/src/control';
import { Position, Physics, CombatManager } from 'engine/src/physics';
import { Arena } from './environment/Arena';
import { Character } from 'engine/src/entities';

export async function setupApp(element: HTMLElement) {
  const players = new Map<string, Character>();
  const ws = new WebSocket('ws://localhost:8080');
  const id = Number(new Date()).toString();
  ws.addEventListener('open', () => {
    ws.send(`player:new:${id}`);
  });
  const app = new Application({ width: 640, height: 320 });
  element.appendChild(app.view as HTMLCanvasElement);
  const arena = new Arena();
  const controller = new LocalController();
  new RemoteDispatcher(id, controller, ws);
  const main = new Cyborg({
    stage: arena.container,
    position: new Position(320, 100),
    controller: controller,
  });
  players.set(id, main);
  const physics = new Physics(main);
  const combatManager = new CombatManager();
  physics.registerGravitableEntities(main);
  physics.registerStaticEntities(...arena.staticEntities);
  combatManager.addPlayers(main);
  app.stage.addChild(arena.container);
  app.ticker.add((delta) => {
    physics.update(delta);
  });
  initRemotePositionUpdate(id);
  ws.addEventListener('message', (event) => {
    const message = event.data;
    const action = message.toString();
    if (action.startsWith(`player:new:`)) {
      ws.send(`player:coords:${id}:${main.position.x}:${main.position.y}`);
      const playerId = action.replace(`player:new:`, '');
      if (playerId === id) {
        return;
      }
      connectRemotePlayer(playerId);
    } else if (action.startsWith(`player:coords:`)) {
      const [playerId, x, y] = action.replace(`player:coords:`, '').split(':');
      if (playerId === id) {
        return;
      }
      const player = players.get(playerId);
      const position = new Position(Number(x), Number(y));
      if (player) {
        player.setPosition(position);
      } else {
        connectRemotePlayer(playerId, position);
      }
    } else if (action.startsWith(`player:leave:`)) {
      const playerId = action.replace(`player:leave:`, '');
      const player = players.get(playerId);
      if (player) {
        player.takeDamage(999999999);
        players.delete(playerId);
      }
    }
  });
  ws.addEventListener('close', () => {
    ws.send(`player:leave:${id}`);
  });
  window.onbeforeunload = () => {
    ws.send(`player:leave:${id}`);
  };
  return app;

  function initRemotePositionUpdate(id: string) {
    setInterval(() => {
      const player = players.get(id);
      if (!player) {
        return;
      }
      ws.send(`player:coords:${id}:${player.position.x}:${player.position.y}`);
    }, 1000);
  }
  function connectRemotePlayer(
    playerId: string,
    position: Position = new Position(320, 100)
  ) {
    const newPlayer = new Biker({
      stage: arena.container,
      position: position,
      controller: new RemoteController(playerId, ws),
    });
    players.set(playerId, newPlayer);
    physics.registerGravitableEntities(newPlayer);
    combatManager.addPlayers(newPlayer);
    initRemotePositionUpdate(playerId);
    return newPlayer;
  }
}
