import { type Container, type AnimatedSprite } from 'pixi.js';
import getAnimation from 'utils/src/getAnimation';

import idleFrames from 'assets/bosses/robot/sprites/Idle.png';
import walkFrames from 'assets/bosses/robot/sprites/Walk.png';

const robotAnimations = {
  idle: await getAnimation(idleFrames),
  walk: await getAnimation(walkFrames)
}

export class Robot {
  state: keyof typeof robotAnimations = 'idle';
  private currentSprite: AnimatedSprite | null = null;
  private position: { x: number, y: number } = { x: 0, y: 0 };

  constructor(private stage: Container) {
    this.switchAnimation('idle')
    setInterval(() => {
      const newState = this.state === 'idle' ? 'walk' : 'idle';
      this.switchAnimation(newState)
      console.log(newState)
    }, 3000)
  }

  setPosition(x: number, y: number) {
    this.position.x = x;
    this.position.y = y;
    if (this.currentSprite) {
      this.currentSprite.x = this.position.x;
      this.currentSprite.y = this.position.y;
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
      this.stage.removeChild(this.currentSprite);
    }
    this.currentSprite = robotAnimations[state];
    this.currentSprite.x = this.position.x;
    this.currentSprite.y = this.position.y;
    this.currentSprite.animationSpeed = 1/12;
    this.currentSprite.play();
    this.stage.addChild(this.currentSprite);
    this.state = state;
  }
}