import { Vector2 } from '.';
import { Character } from '../entities';
import { Collider } from './Collider';

export class CombatManager {
  players: Character[] = [];

  addPlayers(...players: Character[]) {
    for (const player of players) {
      this.players.push(player);
      player.setCombatManager(this);
    }
  }

  hit(
    attacker: Character,
    damage: number,
    options?: {
      hitbox?: Collider;
      knockback?: Vector2;
    }
  ) {
    const hitbox = options?.hitbox ?? attacker.collider;
    const knockback = options?.knockback ?? new Vector2(0, 0);
    const targets = this.searchHitTargets(attacker, hitbox);
    for (const target of targets) {
      target.takeDamage(damage);
      target.outerVelocity = target.outerVelocity.add(knockback);
    }
  }

  private searchHitTargets(attacker: Character, hitbox: Collider) {
    return this.players.filter((player) => {
      if (player === attacker) {
        return false;
      }
      if (hitbox.isCollidingWith(player.collider)) {
        return true;
      }
      return false;
    });
  }
}
