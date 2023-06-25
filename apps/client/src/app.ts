import { Application } from 'pixi.js';
import { Robot } from './bosses/Robot';

export async function setupApp(element: HTMLElement) {
  const app = new Application({ width: 640, height: 360 });
  element.appendChild(app.view as HTMLCanvasElement);
  const robot = new Robot();
  app.stage.addChild(robot.container);
  app.ticker.add((delta) => {
    robot.onUpdate(delta);
  });
  return app;
}
