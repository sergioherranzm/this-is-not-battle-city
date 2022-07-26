import { Point } from '../types/Point';
import { MapBlock } from './MapBlock';
import sprite_destructible_1 from '../assets/tiles/Crate_entera.png'
import sprite_destructible_2 from '../assets/tiles/Crate_rota.png'
import sprite_notDestructible from '../assets/tiles/rock.png'
import { actors } from '../script';

export class DestructibleBlock extends MapBlock {
  constructor(position: Point) {
    super(position, 2, sprite_destructible_1, true, true, true);
  }

  update(delta: number): void {

    if (this.health <= 1) {
      this.actorSprite.src = sprite_destructible_2;
    }

    if (this.health <= 0) {
      const actorToRemove = actors.indexOf(this);
      actors.splice(actorToRemove, 1);
    };

  };

}

export class NotDestructibleBlock extends MapBlock {
  constructor(position: Point) {
    super(position, 99 ** 99, sprite_notDestructible, true, true, false);
  }
}
