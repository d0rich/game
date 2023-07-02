import { Container } from 'pixi.js';
import { Controller } from '../control';
import { PlayableCreature } from './PlayableCreature';
import { Collider, Position, Vector2, CombatManager } from '../physics';
import { Direction } from '.';

export abstract class Character extends PlayableCreature {
  health: number;
  speed = 3;
  protected maxHealth = 100;
  protected combatManager: CombatManager | null = null;

  constructor(options: ConstructorParameters<typeof PlayableCreature>[0]) {
    super(options);
    this.health = this.maxHealth;
  }

  get collider(): Collider {
    return Collider.fromCreature(this, 18);
  }

  takeDamage(damage: number) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.die();
      return;
    }
    this.blockAnimation = true;
    this.switchAnimation('hurt', {
      oneTime: true,
      onComplete: () => {
        this.blockAnimation = false;
        this.switchAnimation('idle');
      },
    });
  }

  setCombatManager(combatManager: CombatManager) {
    this.combatManager = combatManager;
  }

  protected die() {
    this.blockAnimation = true;
    this.switchAnimation('die', {
      oneTime: true,
    });
    this._ownVelocity = new Vector2(0, 0);
    this.disconnectController();
  }

  protected goLeft() {
    this._ownVelocity = this._ownVelocity.add(new Vector2(-this.speed, 0));
  }

  protected stopLeft() {
    this._ownVelocity = this._ownVelocity.add(new Vector2(this.speed, 0));
  }

  protected goRight() {
    this._ownVelocity = this._ownVelocity.add(new Vector2(this.speed, 0));
  }

  protected stopRight() {
    this._ownVelocity = this._ownVelocity.add(new Vector2(-this.speed, 0));
  }

  protected jump() {
    if (this.velocity.y === 0) {
      this.outerVelocity = this.outerVelocity.add(
        new Vector2(0, this.speed * 5)
      );
    }
  }

  protected attack1() {
    if (this.blockAnimation) return;
    this.blockAnimation = true;
    this.switchAnimation(this.ownVelocity.x === 0 ? 'attack1' : 'walkAttack', {
      oneTime: true,
      onComplete: () => {
        this.blockAnimation = false;
        this.combatManager
          ?.searchHitTargets(this, this.collider)
          .forEach((player) => {
            player.takeDamage(10);
          });
      },
    });
  }

  protected attack2() {
    if (this.ownVelocity.x !== 0) return;
    if (this.blockAnimation) return;
    this.blockAnimation = true;
    this.switchAnimation('attack2', {
      oneTime: true,
      onComplete: () => {
        this.blockAnimation = false;
        this.combatManager
          ?.searchHitTargets(this, this.collider)
          .forEach((player) => {
            player.takeDamage(15);
          });
      },
    });
  }

  protected attack3() {
    if (this.ownVelocity.x !== 0) return;
    if (this.blockAnimation) return;
    this.blockAnimation = true;
    this.switchAnimation('attack3', {
      oneTime: true,
      onComplete: () => {
        this.blockAnimation = false;
        this.combatManager
          ?.searchHitTargets(this, this.collider)
          .forEach((player) => {
            player.takeDamage(20);
          });
      },
    });
  }

  protected punch() {
    if (this.ownVelocity.x !== 0) return;
    if (this.blockAnimation) return;
    this.blockAnimation = true;
    this.switchAnimation('punch', {
      oneTime: true,
      onComplete: () => {
        this.blockAnimation = false;
        this.combatManager
          ?.searchHitTargets(this, this.collider)
          .forEach((player) => {
            player.takeDamage(5);
            player.outerVelocity = player.outerVelocity.add(
              new Vector2(
                this.direction === Direction.LEFT ? -3 : 3,
                this.speed * 2
              )
            );
          });
      },
    });
  }

  protected setupController(controller: Controller) {
    this.controllerListeners = {
      'left:start': this.goLeft.bind(this),
      'left:stop': this.stopLeft.bind(this),
      'right:start': this.goRight.bind(this),
      'right:stop': this.stopRight.bind(this),
      'up:start': this.jump.bind(this),
      attack1: this.attack1.bind(this),
      attack2: this.attack2.bind(this),
      attack3: this.attack3.bind(this),
      punch: this.punch.bind(this),
    };
    Object.entries(this.controllerListeners).forEach(([event, listener]) => {
      controller.addEventListener(event, listener);
    });
  }
}
