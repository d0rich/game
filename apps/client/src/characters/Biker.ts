import { Container } from 'pixi.js';
import { Collider, Position, Vector2 } from 'engine/src/physics';
import getAnimation from 'utils/src/getAnimation';
import type { Controller } from 'engine/src/control';
import { CreatureAnimations, PlayableCreature } from 'engine/src/entities';

import idleFrames from 'assets/characters/biker/sprites/Biker_idle.png';
import walkFrames from 'assets/characters/biker/sprites/Biker_run.png';
import jumpFrames from 'assets/characters/biker/sprites/Biker_jump.png';

const animationOptions: Parameters<typeof getAnimation>[1] = {
  height: 36,
  width: 36,
};

const bikerAnimations: CreatureAnimations = {
  idle: await getAnimation(idleFrames, animationOptions),
  walk: await getAnimation(walkFrames, animationOptions),
  jump: await getAnimation(jumpFrames, animationOptions),
};

export class Biker extends PlayableCreature {
  constructor(options?: {
    position?: Position;
    stage?: Container;
    controller?: Controller;
  }) {
    super({
      position: options?.position,
      stage: options?.stage,
      controller: options?.controller,
      animations: bikerAnimations,
    });
  }

  get collider(): Collider {
    return Collider.fromCreature(this, 18);
  }

  protected setupController(controller: Controller) {
    const SPEED = 3;
    controller.addEventListener('left:start', () => {
      this.ownVelocity = this.ownVelocity.add(new Vector2(-SPEED, 0));
    });
    controller.addEventListener('left:stop', () => {
      this.ownVelocity = this.ownVelocity.add(new Vector2(SPEED, 0));
    });
    controller.addEventListener('right:start', () => {
      this.ownVelocity = this.ownVelocity.add(new Vector2(SPEED, 0));
    });
    controller.addEventListener('right:stop', () => {
      this.ownVelocity = this.ownVelocity.add(new Vector2(-SPEED, 0));
    });
    controller.addEventListener('up:start', () => {
      if (this.velocity.y === 0) {
        this.outerVelocity = this.outerVelocity.add(new Vector2(0, SPEED * 5));
      }
    });
  }
}
