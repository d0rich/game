import { Application, Graphics } from 'pixi.js';
import { Robot } from './bosses/Robot';
import { Controller } from 'engine/src/Controller';
import { Position } from 'engine/src/Position';
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
    position: new Position(0, 180),
    controller: new Controller(),
  });
  const ground = new Ground({
    stage: app.stage,
    position: new Position(50, 100),
  });
  app.ticker.add((delta) => {
    robot.onUpdate(delta);
  });
  return app;
}
