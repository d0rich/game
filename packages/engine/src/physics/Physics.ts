import { Entity } from '../entities';
import { Position } from './Position';
import { Vector2 } from './Vector2';

const COLLIDER_GAP = 1;

export class Physics {
  gravity = 0.98;
  friction = 0.3;
  gravitableEntities: Entity[] = [];
  staticEntities: Entity[] = [];
  floorsMap: Map<Entity, Entity> = new Map();

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
      const floor = this.checkFloor(entity, deltaTime);
      if (floor) {
        // Apply friction
        const deltaVelocity = this.friction * deltaTime;
        if (Math.abs(entity.outerVelocity.x) < deltaVelocity) {
          entity.setVelocityX(0);
        } else if (entity.outerVelocity.x > 0) {
          entity.setVelocity(
            entity.outerVelocity.subtract(this.friction * deltaTime, 0)
          );
        } else if (entity.outerVelocity.x < 0) {
          entity.setVelocity(
            entity.outerVelocity.add(this.friction * deltaTime, 0)
          );
        }
      } else {
        // Apply graviaty
        entity.setVelocity(
          entity.outerVelocity.add(0, -this.gravity * deltaTime)
        );
      }
      this.checkCollisions(entity, deltaTime);
      entity.onUpdate(deltaTime);
    }
  }

  checkFloor(entity: Entity, deltaTime: number) {
    const floor = this.floorsMap.get(entity);
    // If wentity was on floor
    if (floor) {
      // If entity is not on floor anymore
      if (
        !entity.collider.willCollideWith(1, floor.collider, new Vector2(0, -1))
      ) {
        this.floorsMap.delete(entity);
        return null;
      }
      return floor;
    }
    // If entity was not on floor
    // Check if entity is on floor now
    for (let i = 0; i < this.staticEntities.length; i++) {
      const staticEntity = this.staticEntities[i];
      if (
        // If entity will collide with possible floor
        entity.collider.willCollideWith(
          deltaTime,
          staticEntity.collider,
          entity.velocity
        ) &&
        // If entity is going down
        entity.velocity.y < 0 && // If entity will be close enough to floor
        (staticEntity.collider.top -
          (entity.collider.bottom + entity.velocity.y * deltaTime) <=
          entity.collider.height / 2 ||
          // If entity was above possible floor
          entity.collider.bottom > staticEntity.collider.top)
      ) {
        // Set entity on floor
        entity.setPosition(
          new Position(entity.position.x, staticEntity.collider.top)
        );
        // Stop entity vertical velocity
        entity.setVelocityY(0);
        // Save floor
        this.floorsMap.set(entity, staticEntity);
        return staticEntity;
      }
    }
    return null;
  }

  checkCollisions(entity: Entity, deltaTime: number) {
    for (let i = 0; i < this.staticEntities.length; i++) {
      const staticEntity = this.staticEntities[i];
      const nextEntityCollider = entity.collider.getNextCollider(
        deltaTime,
        entity.velocity
      );
      if (nextEntityCollider.isCollidingWith(staticEntity.collider)) {
        if (
          entity.velocity.y > 0 &&
          entity.collider.left >= staticEntity.collider.left &&
          entity.collider.right <= staticEntity.collider.right
        ) {
          entity.setVelocityY(0);
          entity.setPosition(
            new Position(
              entity.position.x,
              staticEntity.collider.bottom - entity.collider.height
            )
          );
        } else if (entity.velocity.x > 0) {
          entity.setVelocityX(0);
          entity.setPosition(
            new Position(
              staticEntity.collider.left -
                entity.collider.width / 2 -
                COLLIDER_GAP,
              entity.position.y
            )
          );
        } else if (entity.velocity.x < 0) {
          entity.setVelocityX(0);
          entity.setPosition(
            new Position(
              staticEntity.collider.right +
                entity.collider.width / 2 +
                COLLIDER_GAP,
              entity.position.y
            )
          );
        }
      }
    }
  }
}
