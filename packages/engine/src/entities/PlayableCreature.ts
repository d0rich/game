import { Creature, CreatureAnimations } from './Creature';
import { Controller } from '../control';
import { Container } from 'pixi.js';
import { Position } from '../physics';

export abstract class PlayableCreature extends Creature {
  protected controller: Controller | null = null;
  protected controllerListeners: Record<string, () => void> = {};

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
      this.controller = options.controller;
    }
  }

  protected disconnectController() {
    const controller = this.controller;
    if (!controller) return;
    Object.entries(this.controllerListeners).forEach(([key, listener]) => {
      controller.removeEventListener(key, listener);
    });
    this.controllerListeners = {};
  }

  protected abstract setupController(controller: Controller): void;
}
