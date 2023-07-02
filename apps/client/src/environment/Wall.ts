import { Position } from 'engine/src/physics';
import { Container } from 'pixi.js';
import { Block } from 'engine/src/entities';
import { getTexture } from 'utils/src/getTexture';
import textureImage from 'assets/environment/industrial-zone/tiles/IndustrialTile_03.png';

const texture = await getTexture(textureImage);

export class Wall extends Block {
  constructor(options: {
    position?: Position;
    stage?: Container;
    width: number;
    height: number;
  }) {
    super({
      position: options?.position,
      stage: options?.stage,
      texture: texture,
      width: options.width,
      height: options.height,
    });
  }
}
