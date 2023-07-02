import { BaseTexture, Container, Graphics, Texture } from 'pixi.js';
import { Ground } from './Ground';
import { Position } from 'engine/src/physics';
import { Entity } from 'engine/src/entities';
import { getTexture } from 'utils/src/getTexture';
import bg1 from 'assets/environment/industrial-zone/background/1.png';
import bg2 from 'assets/environment/industrial-zone/background/2.png';
import bg3 from 'assets/environment/industrial-zone/background/3.png';
import bg4 from 'assets/environment/industrial-zone/background/4.png';
import bg5 from 'assets/environment/industrial-zone/background/5.png';

const bgTextures = {
  bg1: await getTexture(bg1),
  bg2: await getTexture(bg2),
  bg3: await getTexture(bg3),
  bg4: await getTexture(bg4),
  bg5: await getTexture(bg5),
};

export class Arena {
  container = new Container();
  staticEntities: Entity[] = [];

  constructor() {
    this.setupBackground();
    this.setupStaticEntities();
  }

  setupStaticEntities() {
    this.staticEntities.push(
      new Ground({
        stage: this.container,
        position: new Position(0, 0),
        width: 640,
        height: 64,
      }),
      new Ground({
        stage: this.container,
        position: new Position(200, 64),
        width: 640,
        height: 128,
      })
    );
  }

  setupBackground() {
    const setTexture = (texture: BaseTexture) => {
      const bg = new Graphics();
      bg.beginTextureFill({ texture: Texture.from(texture) });
      bg.drawRect(0, 0, 640, 360);
      bg.zIndex = -1;
      this.container.addChild(bg);
    };
    setTexture(bgTextures.bg1);
    setTexture(bgTextures.bg2);
    setTexture(bgTextures.bg3);
    setTexture(bgTextures.bg4);
    setTexture(bgTextures.bg5);
  }
}
