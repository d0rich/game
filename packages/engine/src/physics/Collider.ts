import { Position } from './Position';
import { Vector2 } from './Vector2';
import { Block, Creature } from '../entities';

export class Collider {
  static fromCreature(
    creature: Creature,
    customWidth?: number,
    customHeight?: number
  ) {
    const width = customWidth ?? Math.abs(creature.container.width);
    const height = customHeight ?? Math.abs(creature.container.height);
    return new Collider(creature.position.add(0, height / 2), width, height);
  }

  static fromBlock(block: Block, customWidth?: number, customHeight?: number) {
    const width = customWidth ?? Math.abs(block.container.width);
    const height = customHeight ?? Math.abs(block.container.height);
    return new Collider(
      block.position.add(width / 2, height / 2),
      width,
      height
    );
  }

  constructor(
    readonly center: Position,
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
    return this.center.x - this.width / 2;
  }

  get right() {
    return this.center.x + this.width / 2;
  }

  get top() {
    return this.center.y + this.height / 2;
  }

  get bottom() {
    return this.center.y - this.height / 2;
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

  getNextCollider(delta: number, velocity: Vector2) {
    return new Collider(
      this.center.add(velocity.multiplyByScalar(delta)),
      this.width,
      this.height
    );
  }

  willCollideWith(
    delta: number,
    other: Collider,
    velocity: Vector2 = new Vector2(0, 0),
    otherVelocity: Vector2 = new Vector2(0, 0)
  ) {
    return this.getNextCollider(delta, velocity).isCollidingWith(
      other.getNextCollider(delta, otherVelocity)
    );
  }
}
