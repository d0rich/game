import { Vector2 } from './Vector2';

export class Position {
  constructor(public readonly x: number = 0, public readonly y: number = 0) {}

  add(x: number, y: number): Position;
  add(vector: Vector2): Position;
  add(vectorOrX: Vector2 | number, y?: number) {
    const vector =
      vectorOrX instanceof Vector2 ? vectorOrX : new Vector2(vectorOrX, y);
    return new Position(this.x + vector.x, this.y + vector.y);
  }

  subtract(x: number, y: number): Position;
  subtract(vector: Vector2): Position;
  subtract(vectorOrX: Vector2 | number, y?: number) {
    const vector =
      vectorOrX instanceof Vector2 ? vectorOrX : new Vector2(vectorOrX, y);
    return new Position(this.x - vector.x, this.y - vector.y);
  }

  difference(position: Position) {
    return new Vector2(position.x - this.x, position.y - this.y);
  }
}
