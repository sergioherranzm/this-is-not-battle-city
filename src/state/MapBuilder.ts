import { Actor } from '../actors/Actor';
import { mapLevel1, mapLevel2 } from './Maps'

let pacmanMap = `W`
  .split('\n')
  .map((f) => f.split(''));

export class Map extends Actor {
  draw(ctx: CanvasRenderingContext2D, delta: number): void {
    const totalYRatio = 1000 / pacmanMap.length;
    const totalXRatio = 1000 / pacmanMap[0].length;

    pacmanMap.forEach((line, y) => {
      line.forEach((char, x) => {
        ctx.beginPath();

        if (char === 'W') {
          ctx.rect(x * totalXRatio, y * totalYRatio, totalXRatio, totalYRatio);
        }
        if (char === '.') {
          ctx.arc(
            x * totalXRatio + totalXRatio / 2,
            y * totalYRatio + totalYRatio / 2,
            6,
            0,
            angleToRad(360)
          );
        }

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
    });
  }
}
