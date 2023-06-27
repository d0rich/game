import { Application, Graphics } from 'pixi.js';
import { Robot } from './bosses/Robot';
import { Controller } from 'engine/src/control';
import { Position, Physics } from 'engine/src/physics';
import { Ground } from './environment/Ground';

export async function setupApp(element: HTMLElement) {
  const app = new Application({ width: 640, height: 360 });
  const fullScreenContainer = new Graphics();
  fullScreenContainer.beginFill(0x000000);
  fullScreenContainer.drawRect(0, 0, 640, 360);
  fullScreenContainer.zIndex = -1;
  element.appendChild(app.view as HTMLCanvasElement);
  app.stage.addChild(fullScreenContainer);
  const robot = new Robot({
    stage: app.stage,
    position: new Position(50, 300),
    controller: new Controller(),
  });
  const physics = new Physics(robot);
  const ground = new Ground({
    stage: app.stage,
    position: new Position(0, 0),
    width: 640,
    height: 64,
  });
  const ground2 = new Ground({
    stage: app.stage,
    position: new Position(200, 64),
    width: 640,
    height: 128,
  });
  physics.registerGravitableEntities(robot);
  physics.registerStaticEntities(ground, ground2);
  app.ticker.add((delta) => {
    physics.update(delta);
  });
  return app;
}
