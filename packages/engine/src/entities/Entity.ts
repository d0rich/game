import { Vector2, Position, Collider } from '../physics';
import { Direction } from './Direction';
import { Container, AnimatedSprite, Sprite } from 'pixi.js';

export abstract class Entity {
  direction: Direction = Direction.RIGHT;
  outerVelocity: Vector2 = new Vector2(0, 0);
  readonly container: Container = new Container();
  protected _ownVelocity: Vector2 = new Vector2(0, 0);
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

  get ownVelocity() {
    return this._ownVelocity;
  }

  get velocity() {
    return this.outerVelocity.add(this._ownVelocity);
  }

  get position() {
    return new Position(
      this.container.x,
      this.container.parent?.height - this.container.y
    );
  }

  get collider() {
    const width = this.container.width;
    const height = this.container.height;
    return new Collider(
      this.position.add(width / 2, -height / 2),
      width,
      height
    );
  }

  onUpdate(delta: number) {
    const newPosition = this.position.add(
      this.velocity.multiplyByScalar(delta)
    );
    this.setPosition(newPosition);
  }

  setPosition(position: Position) {
    this.container.x = position.x;
    this.container.y = this.container.parent?.height - position.y;
  }

  setVelocity(velocity: Vector2) {
    this.outerVelocity = velocity;
  }

  setVelocityX(x: number) {
    this.outerVelocity = new Vector2(x, this.outerVelocity.y);
  }

  setVelocityY(y: number) {
    this.outerVelocity = new Vector2(this.outerVelocity.x, y);
  }

  resetVelocity() {
    this.outerVelocity = new Vector2(0, 0);
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
