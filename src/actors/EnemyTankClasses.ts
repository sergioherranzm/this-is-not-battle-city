import { Point } from '../types/Point';
import { EnemyTank } from './EnemyTank';
import sprite_standard from '../assets/actors/EnemyStandard_Tank_A.png'
import sprite_rapid from '../assets/actors/EnemyRapid_Tank_A.png'
import sprite_heavy from '../assets/actors/EnemyHeavy_Tank_A.png'
import sprite_strong from '../assets/actors/EnemyStrong_Tank_A.png'

export class EnemyTankStandard extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 1, sprite_standard, 100, 1);
  }
}

export class EnemyTankHeavy extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 5, sprite_heavy, 80, 1);
  }
}

export class EnemyTankRapid extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 1, sprite_rapid, 150, 1);
  }
}

export class EnemyTankStrong extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 2, sprite_strong, 60, 2);
  }
}

