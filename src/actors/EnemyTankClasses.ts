import { Point } from '../types/Point';
import { EnemyTank } from './EnemyTank';
import sprite_standard_1 from '../assets/actors/EnemyStandard_Tank_A.png';
import sprite_standard_2 from '../assets/actors/EnemyStandard_Tank_B.png';
import sprite_rapid_1 from '../assets/actors/EnemyRapid_Tank_A.png';
import sprite_rapid_2 from '../assets/actors/EnemyRapid_Tank_B.png';
import sprite_heavy_1 from '../assets/actors/EnemyHeavy_Tank_A.png';
import sprite_heavy_2 from '../assets/actors/EnemyHeavy_Tank_B.png';
import sprite_strong_1 from '../assets/actors/EnemyStrong_Tank_A.png';
import sprite_strong_2 from '../assets/actors/EnemyStrong_Tank_B.png';

export class EnemyTankStandard extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 1, sprite_standard_1, sprite_standard_2, 100, 1, 0.8, 100);
  };
};

export class EnemyTankRapid extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 1, sprite_rapid_1, sprite_rapid_2, 150, 1, 0.5, 150);
  };
};

export class EnemyTankHeavy extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 4, sprite_heavy_1, sprite_heavy_2, 60, 1, 0.8, 400);
  };
};

export class EnemyTankStrong extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 2, sprite_strong_1, sprite_strong_2, 80, 2, 2, 300);
  };
};

