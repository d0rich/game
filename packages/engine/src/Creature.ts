import { Vector2 } from './Vector2';
import { Position } from './Position';
import { Direction } from './Direction';
import { Container, type AnimatedSprite } from 'pixi.js';

export type CreatureAnimations = {
  idle: AnimatedSprite;
  walk: AnimatedSprite;
};

export default abstract class Creature {
  state: keyof CreatureAnimations = 'idle';
  velocity: Vector2 = new Vector2(0, 0);
  direction: Direction = Direction.RIGHT;
  readonly container: Container = new Container();
  protected ownVelocity: Vector2 = new Vector2(0, 0);
  private animations: CreatureAnimations;

  private currentSprite: AnimatedSprite | null = null;

  constructor(options: {
    position?: Position;
    stage?: Container;
    animations: CreatureAnimations;
  }) {
    this.animations = options.animations;
    this.switchAnimation('idle', { forceUpdate: true });
    this.currentSprite = this.animations.idle;
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
  }

  get position() {
    return new Position(
      this.container.x,
      this.container.parent?.height - this.container.y
    );
  }

  onUpdate(delta: number) {
    const newPosition = this.position.add(
      this.ownVelocity.add(this.velocity).multiplyByScalar(delta)
    );
    this.setPosition(newPosition);
    if (this.ownVelocity.x > 0) {
      this.direction = Direction.RIGHT;
    } else if (this.ownVelocity.x < 0) {
      this.direction = Direction.LEFT;
    }
    this.container.scale.x = this.direction === Direction.RIGHT ? 1 : -1;
    this.switchAnimation(this.ownVelocity.x === 0 ? 'idle' : 'walk');
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

  protected switchAnimation(
    state: keyof CreatureAnimations,
    options?: {
      forceUpdate?: boolean;
    }
  ) {
    if (this.state === state && !options?.forceUpdate) {
      return;
    }
    if (this.currentSprite) {
      this.currentSprite.gotoAndStop(0);
      this.container.removeChild(this.currentSprite);
    }
    this.currentSprite = this.animations[state];
    this.currentSprite.animationSpeed = 1 / 12;
    this.currentSprite.play();
    this.container.addChild(this.currentSprite);
    this.state = state;
  }
}
