import { Point } from "./Point";

interface IEnemy {
  type: string;
  position: Point;
  angle: number;
}

export interface ILevel {
  id: string;
  map: string;
  enemies: IEnemy[];
}
