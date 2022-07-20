import { Point } from '../types/Point';
import { actors } from '../script'

export interface IGameManager {
  lives: number;
  chrono: number;
  level: string;
  enemies: number;
  score: number;
  FPS: number;
  draw: (ctx: CanvasRenderingContext2D, delta: number) => void;
  update: (delta: number) => void;
}

export class GameManager {
  position: number;
  currentLap: number;
  currentTime: number;
  totalTime: number;
  lapTimes: number[];
  constructor() {
    let position: Point = { x: 500, y: 500 };
    let radius: number = 400;

    this.barriers = barriers;
    this.currentBarrier = 0;
    this.currentLap = 0;
    this.currentTime = 0;
    this.totalTime = 0;
    this.lapTimes = [0, 0, 0]
  }


  draw(ctx: CanvasRenderingContext2D, delta: number): void {
    ctx.font = '50px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(
      `LAPS: ${this.currentLap}/3`,
      this.position.x,
      this.position.y
    );
    ctx.fillText(`Crono(s): ${this.totalTime.toFixed(3)}`, 0, 120);
    ctx.fillText(`LAP 1: ${this.lapTimes[0].toFixed(3)}`, 59, 180);
    ctx.fillText(`LAP 2: ${this.lapTimes[1].toFixed(3)}`, 59, 240);
    ctx.fillText(`LAP 3: ${this.lapTimes[2].toFixed(3)}`, 59, 300);
  }

  update(delta: number): void {

  };
};

export let GameInstance: GameManager;

export const createGameInstance = () => {
  GameInstance = new GameManager();
};
