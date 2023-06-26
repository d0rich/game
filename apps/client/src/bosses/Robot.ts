import { Container, type AnimatedSprite } from 'pixi.js';
import { Position } from 'engine/src/Position';
import getAnimation from 'utils/src/getAnimation';
import type { Controller } from '../Controller';

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
    return new Position(this.container.x, this.container.parent?.height - this.container.y);
  }
  get direction() {
    return this.velocity.x > 0 ? Direction.RIGHT : Direction.LEFT;
  }

  private currentSprite: AnimatedSprite | null = null;

  constructor(options?: {
    position?: Position;
    stage?: Container;
    controller?: Controller;
  }) {
    this.switchAnimation('walk');
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height;
    if (options?.stage) {
      options.stage.addChild(this.container);
    }
    if (options?.position) {
      this.setPosition(options.position);
    } else {
      this.setPosition(new Position(0, 0));
    }
    if (options?.controller) {
      options.controller.addEventListener('left:start', () => {
        this.setVelocity(this.velocity.add(new Vector2(-2, 0)));
      });
      options.controller.addEventListener('left:stop', () => {
        this.setVelocity(this.velocity.add(new Vector2(2, 0)));
      });
      options.controller.addEventListener('right:start', () => {
        this.setVelocity(this.velocity.add(new Vector2(2, 0)));
      });
      options.controller.addEventListener('right:stop', () => {
        this.setVelocity(this.velocity.add(new Vector2(-2, 0)));
      });
    }
  }

  onUpdate(delta: number) {
    const newPosition = this.position.add(
      this.velocity.multiplyByScalar(delta)
    );
    this.setPosition(newPosition);
    this.container.scale.x = this.direction === Direction.RIGHT ? 1 : -1;
    this.switchAnimation(this.velocity.x === 0 ? 'idle' : 'walk');
  }

  setPosition(position: Position) {
    this.container.x = position.x;
    this.container.y = this.container.parent?.height - position.y;
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
