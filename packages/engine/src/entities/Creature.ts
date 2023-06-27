import { Direction } from './Direction';
import { Container, type AnimatedSprite } from 'pixi.js';
import { Entity } from './Entity';
import { Collider, Position } from '../physics';

export type CreatureAnimations = {
  idle: AnimatedSprite;
  walk: AnimatedSprite;
  jump: AnimatedSprite;
};

export abstract class Creature extends Entity {
  state: keyof CreatureAnimations = 'idle';
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
    if (this.ownVelocity.x > 0) {
      this.direction = Direction.RIGHT;
    } else if (this.ownVelocity.x < 0) {
      this.direction = Direction.LEFT;
    }
    this.container.scale.x = this.direction === Direction.RIGHT ? 1 : -1;
    if (this.velocity.y !== 0) {
      this.switchAnimation('jump');
    } else {
      this.switchAnimation(this.ownVelocity.x === 0 ? 'idle' : 'walk');
    }
  }

  protected switchAnimation(
    state: keyof CreatureAnimations,
    options?: {
      forceUpdate?: boolean;
    }
  ) {
    if (this.state === state && !options?.forceUpdate) {
      return;
    }
    const newSprite = this.animations[state];
    newSprite.animationSpeed = 1 / 12;
    newSprite.play();
    this.switchSprite(newSprite);
    this.state = state;
  }
}
