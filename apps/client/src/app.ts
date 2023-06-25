import { Application, Sprite } from 'pixi.js';
import robot from 'assets/bosses/robot/sprites/Idle.png';

const sprite = Sprite.from(robot);

export function setupApp(element: HTMLElement) {
  const app = new Application({ width: 640, height: 360 });
  element.appendChild(app.view as HTMLCanvasElement);
  app.stage.addChild(sprite);
  let elapsed = 0.0;
  app.ticker.add((delta) => {
    // Add the time to our total elapsed time
    elapsed += delta;
    // Update the sprite's X position based on the cosine of our elapsed time.  We divide
    // by 50 to slow the animation down a bit...
    sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
  });
  return app;
}
