import { Container } from 'pixi.js';
import { Position, Vector2 } from 'engine/src/physics';
import getAnimation from 'utils/src/getAnimation';
import type { Controller } from 'engine/src/control';
import { CreatureAnimations, PlayableCreature } from 'engine/src/entities';

import idleFrames from 'assets/bosses/robot/sprites/Idle.png';
import walkFrames from 'assets/bosses/robot/sprites/Walk.png';
import attack1Frames from 'assets/bosses/robot/sprites/Attack1.png';
import attack2Frames from 'assets/bosses/robot/sprites/Attack2.png';
import attack3Frames from 'assets/bosses/robot/sprites/Attack3.png';
import specialFrames from 'assets/bosses/robot/sprites/Special.png';

const animationOptions: Parameters<typeof getAnimation>[1] = {
  height: 64,
  width: 64,
};

const robotAnimations: CreatureAnimations = {
  idle: await getAnimation(idleFrames, animationOptions),
  walk: await getAnimation(walkFrames, animationOptions),
  jump: await getAnimation(specialFrames, animationOptions),
};

export class Robot extends PlayableCreature {
  constructor(options?: {
    position?: Position;
    stage?: Container;
    controller?: Controller;
  }) {
    super({
      position: options?.position,
      stage: options?.stage,
      controller: options?.controller,
      animations: robotAnimations,
    });
  }

  protected setupController(controller: Controller) {
    controller.addEventListener('left:start', () => {
      this.ownVelocity = this.ownVelocity.add(new Vector2(-2, 0));
    });
    controller.addEventListener('left:stop', () => {
      this.ownVelocity = this.ownVelocity.add(new Vector2(2, 0));
    });
    controller.addEventListener('right:start', () => {
      this.ownVelocity = this.ownVelocity.add(new Vector2(2, 0));
    });
    controller.addEventListener('right:stop', () => {
      this.ownVelocity = this.ownVelocity.add(new Vector2(-2, 0));
    });
    controller.addEventListener('up:start', () => {
      if (this.velocity.y === 0) {
        this.outsideVelocity = this.outsideVelocity.add(new Vector2(0, 20));
      }
    });
  }
}
