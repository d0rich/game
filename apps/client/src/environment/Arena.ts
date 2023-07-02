import { Container, Graphics } from 'pixi.js';
import { Ground } from './Ground';
import { Position } from 'engine/src/physics';
import { Entity } from 'engine/src/entities';

export class Arena {
  container = new Container();
  staticEntities: Entity[] = [];

  constructor() {
    const fullScreenContainer = new Graphics();
    fullScreenContainer.beginFill(0x000000);
    fullScreenContainer.drawRect(0, 0, 640, 360);
    fullScreenContainer.zIndex = -1;
    this.container.addChild(fullScreenContainer);
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
}
