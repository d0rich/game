import { Creature, CreatureAnimations } from './Creature';
import { Controller } from './Controller';
import { Container } from 'pixi.js';
import { Position } from './Position';

export abstract class PlayableCreature extends Creature {
  constructor(options: {
    position?: Position;
    stage?: Container;
    controller?: Controller;
    animations: CreatureAnimations;
  }) {
    super({
      position: options?.position,
      stage: options?.stage,
      animations: options.animations,
    });
    if (options?.controller) {
      this.setupController(options.controller);
    }
  }

  protected abstract setupController(controller: Controller): void;
}