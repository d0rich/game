import { Container, BaseTexture, TilingSprite } from 'pixi.js';
import { Position } from './Position';
import { Entity } from './Entity';
import { Collider } from './Collider';

export abstract class Block extends Entity {
  constructor(options: {
    texture: BaseTexture;
    position?: Position;
    stage?: Container;
  }) {
    super(options);
    const sprite = TilingSprite.from(options.texture, {
      width: 560,
      height: 64,
    });
    this.switchSprite(sprite);
    this.container.pivot.y = this.container.height;
  }

  get collider() {
    return Collider.fromBlock(this);
  }
}
