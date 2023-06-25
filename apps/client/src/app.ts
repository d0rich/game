import { Application, Container, Graphics } from 'pixi.js';
import { Robot } from './bosses/Robot';
import { Position } from 'engine/src/Position';

export async function setupApp(element: HTMLElement) {
  const app = new Application({ width: 640, height: 360 });
  const fullScreenContainer = new Graphics()
  fullScreenContainer.beginFill(0x000000)
  fullScreenContainer.drawRect(0, 0, 640, 360)
  fullScreenContainer.zIndex = -1
  element.appendChild(app.view as HTMLCanvasElement);
  app.stage.addChild(fullScreenContainer)
  const robot = new Robot({
    stage: app.stage,
    position: new Position(0, 180)
  });
  robot.setVelocityY(.3);
  app.ticker.add((delta) => {
    robot.onUpdate(delta);
  });
  return app;
}
