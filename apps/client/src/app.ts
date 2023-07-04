import { Application } from 'pixi.js';
import { Cyborg } from './characters/Cyborg';
import { Biker } from './characters/Biker';
import { LocalController } from 'engine/src/control';
import { RemoteClient } from 'engine/src/remote';
import { Position, Physics, CombatManager } from 'engine/src/physics';
import { Arena } from './environment/Arena';

export async function setupApp(element: HTMLElement) {
  const app = new Application({ width: 640, height: 320 });
  element.innerHTML = '';
  element.appendChild(app.view as HTMLCanvasElement);
  const arena = new Arena();
  const main = new Cyborg({
    stage: arena.container,
    position: new Position(320, 100),
    controller: new LocalController(),
  });
  const physics = new Physics(main);
  const combatManager = new CombatManager();
  physics.registerGravitableEntities(main);
  physics.registerStaticEntities(...arena.staticEntities);
  combatManager.addPlayers(main);
  new RemoteClient(main, {
    spawnPlayer: (position) => {
      const biker = new Biker({
        stage: arena.container,
        position,
      });
      physics.registerGravitableEntities(biker);
      combatManager.addPlayers(biker);
      return biker;
    },
  });
  app.stage.addChild(arena.container);
  app.ticker.add((delta) => {
    physics.update(delta);
  });
  return app;
}
