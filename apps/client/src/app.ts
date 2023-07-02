import { Application } from 'pixi.js';
// import { Robot } from './bosses/Robot';
import { Punk } from './characters/Punk';
import { Cyborg } from './characters/Cyborg';
// import { Biker } from './characters/Biker';
import { Controller } from 'engine/src/control';
import { Position, Physics, CombatManager } from 'engine/src/physics';
import { Arena } from './environment/Arena';

export async function setupApp(element: HTMLElement) {
  const app = new Application({ width: 640, height: 320 });
  element.appendChild(app.view as HTMLCanvasElement);
  const arena = new Arena();
  const main = new Cyborg({
    stage: arena.container,
    position: new Position(50, 50),
    controller: new Controller(),
  });
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
  return app;
}
