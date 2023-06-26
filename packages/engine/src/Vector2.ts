export class Vector2 {
  constructor(public readonly x: number = 0, public readonly y: number = 0) {}

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get normalized() {
    const magnitude = this.magnitude;
    return new Vector2(this.x / magnitude, this.y / magnitude);
  }

  add(x: number, y: number): Vector2;
  add(vector: Vector2): Vector2;
  add(vectorOrX: Vector2 | number, y?: number) {
    const vector =
      vectorOrX instanceof Vector2 ? vectorOrX : new Vector2(vectorOrX, y);
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  subtract(x: number, y: number): Vector2;
  subtract(vector: Vector2): Vector2;
  subtract(vectorOrX: Vector2 | number, y?: number) {
    const vector =
      vectorOrX instanceof Vector2 ? vectorOrX : new Vector2(vectorOrX, y);
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  multiplyByScalar(scalar: number) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  angleBetween(vector: Vector2) {
    return Math.acos(
      (vector.y * this.y + vector.x * this.x) /
        (vector.magnitude * this.magnitude)
    );
  }

  project(vector: Vector2) {
    if (!vector.magnitude || !this.magnitude) {
      return new Vector2(0, 0);
    }
    return vector.multiplyByScalar(Math.cos(this.angleBetween(vector)) * this.magnitude);
  }
}
