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
    position: new Position(50, 50),
    controller: controller,
  });
  players.set(id, main);
  const doll = new Punk({
    stage: arena.container,
    position: new Position(100, 50),
  });
  const physics = new Physics(main);
  const combatManager = new CombatManager();
  physics.registerGravitableEntities(main, doll);
  physics.registerStaticEntities(...arena.staticEntities);
  combatManager.addPlayers(main, doll);
  app.stage.addChild(arena.container);
  app.ticker.add((delta) => {
    physics.update(delta);
  });
  ws.addEventListener('message', (event) => {
    const message = event.data;
    const action = message.toString();
    if (action.startsWith(`player:new:`)) {
      ws.send(`player:coords:${id}:${main.position.x}:${main.position.y}`);
      const playerId = action.replace(`player:new:`, '');
      if (playerId === id) {
        return;
      }
      const newPlayer = new Biker({
        stage: arena.container,
        position: new Position(100, 100),
        controller: new RemoteController(playerId, ws),
      });
      players.set(playerId, newPlayer);
      physics.registerGravitableEntities(newPlayer);
      combatManager.addPlayers(newPlayer);
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
        const newPlayer = new Biker({
          stage: arena.container,
          position: position,
          controller: new RemoteController(playerId, ws),
        });
        players.set(playerId, newPlayer);
        physics.registerGravitableEntities(newPlayer);
        combatManager.addPlayers(newPlayer);
      }
    }
  });
  return app;
}
