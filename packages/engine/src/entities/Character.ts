import { Container } from 'pixi.js';
import { Controller } from '../control';
import { PlayableCreature } from './PlayableCreature';
import { Collider, Position, Vector2 } from '../physics';

export abstract class Character extends PlayableCreature {
  constructor(options: ConstructorParameters<typeof PlayableCreature>[0]) {
    super(options);
  }

  get collider(): Collider {
    return Collider.fromCreature(this, 18);
  }

  protected setupController(controller: Controller) {
    const SPEED = 3;
    controller.addEventListener('left:start', () => {
      this._ownVelocity = this._ownVelocity.add(new Vector2(-SPEED, 0));
    });
    controller.addEventListener('left:stop', () => {
      this._ownVelocity = this._ownVelocity.add(new Vector2(SPEED, 0));
    });
    controller.addEventListener('right:start', () => {
      this._ownVelocity = this._ownVelocity.add(new Vector2(SPEED, 0));
    });
    controller.addEventListener('right:stop', () => {
      this._ownVelocity = this._ownVelocity.add(new Vector2(-SPEED, 0));
    });
    controller.addEventListener('up:start', () => {
      if (this.velocity.y === 0) {
        this.outerVelocity = this.outerVelocity.add(new Vector2(0, SPEED * 5));
      }
    });
    controller.addEventListener('attack1', () => {
      if (this.blockAnimation) return;
      this.blockAnimation = true;
      this.switchAnimation(
        this.ownVelocity.x === 0 ? 'attack1' : 'walkAttack',
        {
          oneTime: true,
          onComplete: () => {
            this.blockAnimation = false;
          },
        }
      );
    });
    controller.addEventListener('attack2', () => {
      if (this.ownVelocity.x !== 0) return;
      if (this.blockAnimation) return;
      this.blockAnimation = true;
      this.switchAnimation('attack2', {
        oneTime: true,
        onComplete: () => {
          this.blockAnimation = false;
        },
      });
    });
    controller.addEventListener('attack3', () => {
      if (this.ownVelocity.x !== 0) return;
      if (this.blockAnimation) return;
      this.blockAnimation = true;
      this.switchAnimation('attack3', {
        oneTime: true,
        onComplete: () => {
          this.blockAnimation = false;
        },
      });
    });
    controller.addEventListener('punch', () => {
      if (this.ownVelocity.x !== 0) return;
      if (this.blockAnimation) return;
      this.blockAnimation = true;
      this.switchAnimation('punch', {
        oneTime: true,
        onComplete: () => {
          this.blockAnimation = false;
        },
      });
    });
  }
}
