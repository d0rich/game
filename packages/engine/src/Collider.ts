import { Position } from './Position';
import { Vector2 } from './Vector2';

export class Collider {
  constructor(
    readonly position: Position,
    readonly width: number,
    readonly height: number
  ) {
    if (width < 0) {
      throw new Error('Width cannot be negative');
    }
    if (height < 0) {
      throw new Error('Height cannot be negative');
    }
  }

  get left() {
    return this.position.x - this.width / 2;
  }

  get right() {
    return this.position.x + this.width / 2;
  }

  get top() {
    return this.position.y + this.height;
  }

  get bottom() {
    return this.position.y;
  }

  get center() {
    return this.position.add(new Vector2(0, this.height / 2));
  }

  isCollidingWith(other: Collider) {
    return (
      this.left < other.right &&
      this.right > other.left &&
      this.top > other.bottom &&
      this.bottom < other.top
    );
  }

  isCollidingWithPoint(point: Position) {
    return (
      this.left < point.x &&
      this.right > point.x &&
      this.top > point.y &&
      this.bottom < point.y
    );
  }

  willCollideWith(
    delta: number,
    other: Collider,
    velocity: Vector2 = new Vector2(0, 0),
    otherVelocity: Vector2 = new Vector2(0, 0)
  ) {
    const nextPosition = this.position.add(velocity.multiplyByScalar(delta));
    const nextCollider = new Collider(nextPosition, this.width, this.height);
    const nextOtherPosition = other.position.add(
      otherVelocity.multiplyByScalar(delta)
    );
    const nextOtherCollider = new Collider(
      nextOtherPosition,
      other.width,
      other.height
    );
    return nextCollider.isCollidingWith(nextOtherCollider);
  }
}
