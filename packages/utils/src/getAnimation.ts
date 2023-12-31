import {
  Spritesheet,
  BaseTexture,
  type ISpritesheetFrameData,
  AnimatedSprite,
} from 'pixi.js';
import { getTexture } from './getTexture';
import { generateId } from './generateId';

function countFrames(texture: BaseTexture) {
  const { width, height } = texture;
  return width / height;
}

export async function getAnimation(
  path: string,
  options?: {
    height?: number;
    width?: number;
    id?: string;
  }
) {
  const id = options?.id ?? generateId(10);
  const texture = await getTexture(path);
  const frames: Record<string, ISpritesheetFrameData> = {};
  const size = texture.height;
  const animation: string[] = [];
  for (let i = 0; i < countFrames(texture); i++) {
    frames[`${id}${i.toString()}`] = {
      frame: {
        h: options?.height ?? size,
        w: options?.width ?? size,
        x: i * size,
        y: options?.height ? size - options.height : 0,
      },
    };
    animation.push(`${id}${i.toString()}`);
  }
  const spritesheet = new Spritesheet(texture, {
    frames,
    meta: {
      scale: '1',
    },
    animations: {
      animation,
    },
  });
  await spritesheet.parse();
  return function getAnimatedSprite() {
    return new AnimatedSprite(spritesheet.animations.animation);
  };
}
