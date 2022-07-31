import { Point } from "./Point";

export interface IEnemy {
  type: string;
  position: Point;
  angle: number;
}

export interface ILevel {
  id: string;
  background: string;
  map: string;
  enemies: IEnemy[];
}
