import { BaseTexture } from 'pixi.js';

export async function getTexture(path: string) {
  const texture = BaseTexture.from(path);
  await new Promise((resolve) => {
    texture.once('loaded', resolve);
  });
  return texture;
}
