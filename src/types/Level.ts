import { EnemyTank } from "../actors/EnemyTank";
export interface ILevel {
  id: string;
  map: string;
  enemies: EnemyTank[];
}
