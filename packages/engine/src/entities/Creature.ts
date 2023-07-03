import { Direction } from './Direction';
import { Container, type AnimatedSprite } from 'pixi.js';
import { Entity } from './Entity';
import { Collider, Position } from '../physics';

export type CreatureAnimations = {
  idle: AnimatedSprite;
  walk: AnimatedSprite;
  jump: AnimatedSprite;
  punch: AnimatedSprite;
  walkAttack: AnimatedSprite;
  attack1: AnimatedSprite;
  attack2: AnimatedSprite;
  attack3: AnimatedSprite;
  hurt: AnimatedSprite;
  die: AnimatedSprite;
};

export abstract class Creature extends Entity {
  state: keyof CreatureAnimations = 'idle';
  blockAnimation = false;
  private animations: CreatureAnimations;

  constructor(options: {
    position?: Position;
    stage?: Container;
    animations: CreatureAnimations;
  }) {
    super(options);
    this.animations = options.animations;
    this.switchAnimation('idle', { forceUpdate: true });
    this.currentSprite = this.animations.idle;
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height;
  }

  get collider() {
    return Collider.fromCreature(this);
  }

  onUpdate(delta: number) {
    super.onUpdate(delta);
    if (this._ownVelocity.x > 0) {
      this.direction = Direction.RIGHT;
    } else if (this._ownVelocity.x < 0) {
      this.direction = Direction.LEFT;
    }
    this.container.scale.x = this.direction === Direction.RIGHT ? 1 : -1;
    // If animation should not be switched
    if (this.blockAnimation) {
      return;
    }
    if (this.velocity.y !== 0) {
      this.switchAnimation('jump');
    } else {
      if (this._ownVelocity.x === 0) {
        this.switchAnimation('idle');
      } else {
        this.switchAnimation('walk');
      }
    }
  }

  protected switchAnimation(
    state: keyof CreatureAnimations,
    options?: {
      forceUpdate?: boolean;
      oneTime?: boolean;
      onComplete?: () => void;
      onFrameChange?: (frame: number) => void;
    }
  ) {
    if (this.state === state && !options?.forceUpdate) {
      return;
    }
    const newSprite = this.animations[state];
    newSprite.animationSpeed = 1 / 5;
    newSprite.play();
    if (options?.oneTime) {
      newSprite.loop = false;
      newSprite.onComplete = options.onComplete;
      newSprite.onFrameChange = options.onFrameChange;
    }
    this.switchSprite(newSprite);
    this.state = state;
  }
}
