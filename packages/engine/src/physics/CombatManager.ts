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

  searchHitTargets(attacker: Character, hitbox: Collider) {
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
