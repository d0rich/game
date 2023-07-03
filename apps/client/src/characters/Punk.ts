import { AnimatedSprite, Container } from 'pixi.js';
import { Position } from 'engine/src/physics';
import { getAnimation } from 'utils/src/getAnimation';
import type { Controller } from 'engine/src/control';
import { CreatureAnimations, Character } from 'engine/src/entities';

import idleFrames from 'assets/characters/punk/sprites/Punk_idle.png';
import walkFrames from 'assets/characters/punk/sprites/Punk_run.png';
import jumpFrames from 'assets/characters/punk/sprites/Punk_jump.png';
import walkAttackFrames from 'assets/characters/punk/sprites/Punk_run_attack.png';
import attack1Frames from 'assets/characters/punk/sprites/Punk_attack1.png';
import attack2Frames from 'assets/characters/punk/sprites/Punk_attack2.png';
import attack3Frames from 'assets/characters/punk/sprites/Punk_attack3.png';
import punchFrames from 'assets/characters/punk/sprites/Punk_punch.png';
import hurtFrames from 'assets/characters/punk/sprites/Punk_hurt.png';
import deathFrames from 'assets/characters/punk/sprites/Punk_death.png';

const animationOptions: Parameters<typeof getAnimation>[1] = {
  height: 36,
  width: 36,
};

const punkAnimations: Record<keyof CreatureAnimations, () => AnimatedSprite> = {
  idle: await getAnimation(idleFrames, animationOptions),
  walk: await getAnimation(walkFrames, animationOptions),
  jump: await getAnimation(jumpFrames, animationOptions),
  attack1: await getAnimation(attack1Frames, animationOptions),
  attack2: await getAnimation(attack2Frames, animationOptions),
  attack3: await getAnimation(attack3Frames, animationOptions),
  punch: await getAnimation(punchFrames, animationOptions),
  walkAttack: await getAnimation(walkAttackFrames, animationOptions),
  hurt: await getAnimation(hurtFrames, animationOptions),
  die: await getAnimation(deathFrames, animationOptions),
};

export class Punk extends Character {
  constructor(options?: {
    position?: Position;
    stage?: Container;
    controller?: Controller;
  }) {
    super({
      position: options?.position,
      stage: options?.stage,
      controller: options?.controller,
      animations: {
        idle: punkAnimations.idle(),
        walk: punkAnimations.walk(),
        jump: punkAnimations.jump(),
        attack1: punkAnimations.attack1(),
        attack2: punkAnimations.attack2(),
        attack3: punkAnimations.attack3(),
        punch: punkAnimations.punch(),
        walkAttack: punkAnimations.walkAttack(),
        hurt: punkAnimations.hurt(),
        die: punkAnimations.die(),
      },
    });
  }
}
