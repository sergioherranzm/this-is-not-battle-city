import { Point } from '../types/Point';
import { MapBlock } from './MapBlock';
import sprite_destructible_1 from '../assets/tiles/crate_entera.png';
import sprite_destructible_2 from '../assets/tiles/crate_rota.png';
import sprite_notDestructible from '../assets/tiles/rock.png';
import sprite_water from '../assets/tiles/water.png';
import { actors } from '../script';
import { Timer } from '../types/Timer';

export class SpawnPlayerP1 extends MapBlock {
  constructor(position: Point) {
    super(position, 99 ** 99, '', false, false, false);
  };
};

export class DestructibleBlock extends MapBlock {

  constructor(position: Point) {
    super(position, 2, sprite_destructible_1, true, true, true);
  };

  update(delta: number): void {

    if (this.health <= 1) {
      this.actorSprite.src = sprite_destructible_2;
    };

    if (this.health <= 0) {
      const actorToRemove = actors.indexOf(this);
      actors.splice(actorToRemove, 1);
    };

  };

};

export class NotDestructibleBlock extends MapBlock {
  constructor(position: Point) {
    super(position, 99 ** 99, sprite_notDestructible, true, true, false);
  };
};

export class WaterBlock extends MapBlock {
  waterFrame: number;
  waterTimer: Timer;
  constructor(position: Point) {
    super(position, 99 ** 99, sprite_water, true, false, false);
    this.waterFrame = 0;
    this.waterTimer = { time: 0, active: true };
  };

  update(delta: number): void {

    if (this.waterTimer.active === true) {
      this.waterTimer.time += delta;
    }

    if (this.waterTimer.time > 0.08) {
      this.waterFrame++;
      this.waterTimer.time = 0;
    }

    if (this.waterFrame === 40) {
      this.waterFrame = 0;
    }

  }

  draw(ctx: CanvasRenderingContext2D, delta: number): void {
    ctx.translate(this.position.x, this.position.y);
    ctx.drawImage(this.actorSprite, this.waterFrame * 128, 0, 128, 128, - this.size.width / 2, - this.size.height / 2, this.size.width, this.size.height)
  }
};
