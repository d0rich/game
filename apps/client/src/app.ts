import { Application } from 'pixi.js';
import getAnimation from 'utils/src/getAnimation';
import robot from 'assets/bosses/robot/sprites/Idle.png';



export async function setupApp(element: HTMLElement) {
  const sprite = await getAnimation(robot)
  sprite.animationSpeed = 1/12;
  sprite.play();
  const app = new Application({ width: 640, height: 360 });
  element.appendChild(app.view as HTMLCanvasElement);
  app.stage.addChild(sprite);
  return app;
}
