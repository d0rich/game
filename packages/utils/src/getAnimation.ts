import {
  Spritesheet,
  BaseTexture,
  type ISpritesheetFrameData,
  AnimatedSprite,
} from 'pixi.js';

function countFrames(texture: BaseTexture) {
  const { width, height } = texture;
  return width / height;
}

export default async function getAnimation(path: string) {
  const texture = BaseTexture.from(path);
  await new Promise((resolve) => {
    texture.once('loaded', resolve);
  })
  const frames: Record<string, ISpritesheetFrameData> = {};
  const size = texture.height;
  const animation: string[] = []
  for (let i = 0; i < countFrames(texture); i++) {
    frames[i.toString()] = {
      frame: {
        h: size,
        w: size,
        x: i * size,
        y: 0,
      },
    };
    animation.push(i.toString())
  }
  const spritesheet = new Spritesheet(texture, {
    frames,
    meta: {
      scale: '1',
    },
    animations: {
      animation
    }
  });
  await spritesheet.parse();
  console.log(spritesheet.animations);
  const animatedSprite = new AnimatedSprite(spritesheet.animations.animation);
  return animatedSprite;
}
