import { BaseTexture, Container, Graphics, Texture } from 'pixi.js';
import { Ground } from './Ground';
import { Wall } from './Wall';
import { Platform } from './Platform';
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
        height: 32,
      })
    );
    this.staticEntities.push(
      new Wall({
        stage: this.container,
        position: new Position(0, 32),
        width: 32,
        height: 320 - 32,
      }),
      new Wall({
        stage: this.container,
        position: new Position(640 - 32, 32),
        width: 32,
        height: 320 - 32,
      })
    );

    this.staticEntities.push(
      new Platform({
        stage: this.container,
        position: new Position(32 * 3, 32 * 3),
        width: 32 * 3,
        height: 32,
      }),
      new Platform({
        stage: this.container,
        position: new Position(32 * 7, 32 * 6),
        width: 32 * 6,
        height: 32,
      }),
      new Platform({
        stage: this.container,
        position: new Position(32 * 14, 32 * 3),
        width: 32 * 3,
        height: 32,
      })
    );
  }

  setupBackground() {
    const setTexture = (texture: BaseTexture) => {
      const bg = new Graphics();
      bg.beginTextureFill({ texture: Texture.from(texture) });
      bg.drawRect(0, 0, 640, 320);
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
