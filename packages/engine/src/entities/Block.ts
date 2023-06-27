import { Container, BaseTexture, TilingSprite } from 'pixi.js';
import { Position, Collider } from '../physics';
import { Entity } from './Entity';

export abstract class Block extends Entity {
  constructor(options: {
    texture: BaseTexture;
    position?: Position;
    stage?: Container;
    width: number;
    height: number;
  }) {
    super(options);
    const sprite = TilingSprite.from(options.texture, {
      width: options.width,
      height: options.height,
    });
    this.switchSprite(sprite);
    this.container.pivot.y = this.container.height;
  }

  get collider() {
    return Collider.fromBlock(this);
  }
}
