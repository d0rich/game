import { Container, type AnimatedSprite } from 'pixi.js';
import getAnimation from 'utils/src/getAnimation';

import idleFrames from 'assets/bosses/robot/sprites/Idle.png';
import walkFrames from 'assets/bosses/robot/sprites/Walk.png';

const animationOptions: Parameters<typeof getAnimation>[1] = {
  height: 64,
  width: 64,
};

const robotAnimations = {
  idle: await getAnimation(idleFrames, animationOptions),
  walk: await getAnimation(walkFrames, animationOptions),
};

export class Robot {
  state: keyof typeof robotAnimations = 'idle';
  readonly container: Container = new Container();
  private currentSprite: AnimatedSprite | null = null;
  private position: { x: number; y: number } = { x: 0, y: 0 };

  constructor() {
    this.switchAnimation('idle');
    console.log(this);
    setInterval(() => {
      const newState = this.state === 'idle' ? 'walk' : 'idle';
      this.switchAnimation(newState);
      console.log(newState);
    }, 3000);
  }

  setPosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
    if (this.currentSprite) {
      this.container.x = this.position.x;
      this.container.y = this.position.y;
    }
  }

  move(x: number, y: number) {
    this.setPosition(this.position.x + x, this.position.y + y);
  }

  moveX(x: number) {
    this.move(x, 0);
  }

  moveY(y: number) {
    this.move(0, y);
  }

  private switchAnimation(state: keyof typeof robotAnimations) {
    if (this.currentSprite) {
      this.currentSprite.gotoAndStop(0);
      this.container.removeChild(this.currentSprite);
    }
    this.currentSprite = robotAnimations[state];
    this.currentSprite.animationSpeed = 1 / 12;
    this.currentSprite.play();
    this.container.addChild(this.currentSprite);
    this.state = state;
  }
}
