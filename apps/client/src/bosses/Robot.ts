import { Container, type AnimatedSprite } from 'pixi.js';
import { Position } from 'engine/src/Position';
import getAnimation from 'utils/src/getAnimation';

import idleFrames from 'assets/bosses/robot/sprites/Idle.png';
import walkFrames from 'assets/bosses/robot/sprites/Walk.png';
import { Vector2 } from 'engine/src/Vector2';

const animationOptions: Parameters<typeof getAnimation>[1] = {
  height: 64,
  width: 64,
};

const robotAnimations = {
  idle: await getAnimation(idleFrames, animationOptions),
  walk: await getAnimation(walkFrames, animationOptions),
};

// TODO: replace with number enum
enum Direction {
  LEFT = 'left',
  RIGHT = 'right',
}

export class Robot {
  state: keyof typeof robotAnimations = 'idle';
  velocity: Vector2 = new Vector2(0, 0);
  readonly container: Container = new Container();
  get position() {
    return new Position(this.container.x, this.container.y);
  }
  get direction() {
    return this.velocity.x > 0 ? Direction.RIGHT : Direction.LEFT;
  }

  private currentSprite: AnimatedSprite | null = null;

  constructor() {
    this.switchAnimation('walk');
    this.container.pivot.x = this.container.width / 2;
    //this.container.pivot.y = this.container.height / 2;
    setInterval(() => {
      this.setVelocityX(2);
      setTimeout(() => {
        this.resetVelocity();
      }, 3000);
      setTimeout(() => {
        this.setVelocityX(-2);
      }, 4000);
      setTimeout(() => {
        this.resetVelocity();
      }, 7000);
    }, 8000);
  }

  onUpdate(delta: number) {
    const newPosition = this.position.add(
      this.velocity.multiplyByScalar(delta)
    );
    this.container.x = newPosition.x;
    this.container.y = newPosition.y;
    this.container.scale.x = this.direction === Direction.RIGHT ? 1 : -1;
    this.switchAnimation(this.velocity.x === 0 ? 'idle' : 'walk');
  }

  setVelocity(velocity: Vector2) {
    this.velocity = velocity;
  }

  setVelocityX(x: number) {
    this.velocity = new Vector2(x, this.velocity.y);
  }

  setVelocityY(y: number) {
    this.velocity = new Vector2(this.velocity.x, y);
  }

  resetVelocity() {
    this.velocity = new Vector2(0, 0);
  }

  private switchAnimation(state: keyof typeof robotAnimations) {
    if (this.state === state) return;
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
