import {
  Spritesheet,
  BaseTexture,
  type ISpritesheetFrameData,
  AnimatedSprite,
} from 'pixi.js';

export class Animation {
  spritesheet: Spritesheet;
  sprite: AnimatedSprite;

  constructor(private texture: BaseTexture) {
    const frames: Record<string, ISpritesheetFrameData> = {};
    const size = this.texture.height;
    for (let i = 0; i < this.framesCount; i++) {
      frames[i.toString()] = {
        frame: {
          h: size,
          w: size,
          x: i * size,
          y: 0,
        },
      };
    }
    this.spritesheet = new Spritesheet(texture, {
      frames,
      meta: {
        scale: '1',
      },
    });
  }

  get framesCount() {
    const { width, height } = this.texture;
    return width / height;
  }

  async setup() {
    await this.spritesheet.parse();
    console.log(this.spritesheet.animations);
    // this.sprite = new AnimatedSprite(this.spritesheet.animations['0']);
  }
}
