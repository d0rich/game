import { Application } from 'pixi.js';
// import { Robot } from './bosses/Robot';
// import { Punk } from './characters/Punk';
import { Cyborg } from './characters/Cyborg';
// import { Biker } from './characters/Biker';
import { Controller } from 'engine/src/control';
import { Position, Physics } from 'engine/src/physics';
import { Arena } from './environment/Arena';

export async function setupApp(element: HTMLElement) {
  const app = new Application({ width: 640, height: 320 });
  element.appendChild(app.view as HTMLCanvasElement);
  const arena = new Arena();
  const main = new Cyborg({
    stage: arena.container,
    position: new Position(50, 300),
    controller: new Controller(),
  });
  const physics = new Physics(main);
  physics.registerGravitableEntities(main);
  physics.registerStaticEntities(...arena.staticEntities);
  app.stage.addChild(arena.container);
  app.ticker.add((delta) => {
    physics.update(delta);
  });
  return app;
}
