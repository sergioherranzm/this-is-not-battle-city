import { Point } from '../types/Point';
import { EnemyTank } from './EnemyTank';

export class EnemyTankStandard extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 1, 'red', 100, 1);
  }
}

export class EnemyTankHeavy extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 5, 'black', 80, 1);
  }
}

export class EnemyTankRapid extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 1, 'pink', 150, 1);
  }
}

export class EnemyTankStrong extends EnemyTank {
  constructor(position: Point, angle: number) {
    super(position, angle, 2, 'green', 60, 2);
  }
}

