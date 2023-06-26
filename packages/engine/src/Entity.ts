import { Vector2 } from './Vector2';
import { Position } from './Position';
import { Direction } from './Direction';
import { Container, AnimatedSprite, Sprite } from 'pixi.js';
import { Collider } from './Collider';

export abstract class Entity {
  velocity: Vector2 = new Vector2(0, 0);
  direction: Direction = Direction.RIGHT;
  readonly container: Container = new Container();
  protected ownVelocity: Vector2 = new Vector2(0, 0);
  protected currentSprite: Sprite | null = null;

  constructor(options: { position?: Position; stage?: Container }) {
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

  get collider() {
    return new Collider(
      this.position,
      Math.abs(this.container.width),
      Math.abs(this.container.height)
    );
  }

  onUpdate(delta: number) {
    const newPosition = this.position.add(
      this.ownVelocity.add(this.velocity).multiplyByScalar(delta)
    );
    this.setPosition(newPosition);
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

  switchSprite(sprite: Sprite) {
    if (this.currentSprite) {
      if (this.currentSprite instanceof AnimatedSprite) {
        this.currentSprite.gotoAndStop(0);
      }
      this.container.removeChild(this.currentSprite);
    }
    this.container.addChild(sprite);
    this.currentSprite = sprite;
  }
}
