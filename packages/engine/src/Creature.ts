import { Position } from './Position';
import { Direction } from './Direction';
import { Container, type AnimatedSprite } from 'pixi.js';
import { Entity } from './Entity';

export type CreatureAnimations = {
  idle: AnimatedSprite;
  walk: AnimatedSprite;
};

export abstract class Creature extends Entity {
  state: keyof CreatureAnimations = 'idle';
  private animations: CreatureAnimations;

  private currentSprite: AnimatedSprite | null = null;

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

  onUpdate(delta: number) {
    super.onUpdate(delta);
    if (this.ownVelocity.x > 0) {
      this.direction = Direction.RIGHT;
    } else if (this.ownVelocity.x < 0) {
      this.direction = Direction.LEFT;
    }
    this.container.scale.x = this.direction === Direction.RIGHT ? 1 : -1;
    this.switchAnimation(this.ownVelocity.x === 0 ? 'idle' : 'walk');
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
    if (this.currentSprite) {
      this.currentSprite.gotoAndStop(0);
      this.container.removeChild(this.currentSprite);
    }
    this.currentSprite = this.animations[state];
    this.currentSprite.animationSpeed = 1 / 12;
    this.currentSprite.play();
    this.container.addChild(this.currentSprite);
    this.state = state;
  }
}
