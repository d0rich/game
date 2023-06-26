import { Entity } from './Entity';
import { Vector2 } from './Vector2';

const horizontalVector = new Vector2(1, 0);
const verticalVector = new Vector2(0, 1);

export class Physics {
  gravity = 0.98;
  gravitableEntities: Entity[] = [];
  staticEntities: Entity[] = [];

  constructor(public mainEntity: Entity) {}

  registerGravitableEntities(...entities: Entity[]) {
    this.gravitableEntities.push(...entities);
  }

  registerStaticEntities(...entities: Entity[]) {
    this.staticEntities.push(...entities);
  }

  update(deltaTime: number) {
    for (let i = 0; i < this.gravitableEntities.length; i++) {
      const entity = this.gravitableEntities[i];
      entity.setVelocity(entity.outsideVelocity.add(0, -this.gravity * deltaTime));
    }
    this.checkCollisions(this.mainEntity, deltaTime);
    // console.log(this.mainEntity.velocity);
    this.mainEntity.onUpdate(deltaTime);
    
  }

  checkCollisions(entity: Entity, deltaTime: number) {
    for (let i = 0; i < this.staticEntities.length; i++) {
      const staticEntity = this.staticEntities[i];
      if (
        entity.collider.willCollideWith(
          deltaTime,
          staticEntity.collider,
          entity.velocity
        )
      ) {
        entity.outsideVelocity = new Vector2(0, 0);
        if (Math.abs(entity.velocity.x) > Math.abs(entity.velocity.y)) {
          entity.outsideVelocity = entity.velocity.project(verticalVector).multiplyByScalar(-1);
        } else {
          entity.outsideVelocity = entity.velocity.project(horizontalVector).multiplyByScalar(-1);
        }
      }
    }
  }
}
