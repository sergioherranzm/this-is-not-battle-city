import { Point } from '../types/Point';
import { PowerUp } from './PowerUp';
import sprite_life from '../assets/tiles/powerup_life.png';
import sprite_speed from '../assets/tiles/powerup_speed.png';
import sprite_damage from '../assets/tiles/powerup_damage.png';

export class PowerUpLife extends PowerUp {
  constructor(position: Point) {
    super(position, sprite_life, '+life');
  };
};

export class PowerUpSpeed extends PowerUp {
  constructor(position: Point) {
    super(position, sprite_speed, '+speed');
  };
};

export class PowerUpDamage extends PowerUp {
  constructor(position: Point) {
    super(position, sprite_damage, '+damage');
  };
};