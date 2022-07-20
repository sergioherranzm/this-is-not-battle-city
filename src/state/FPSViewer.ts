import { Actor } from '../actors/Actor';
import { Point } from '../types/Point';

export class FPSViewer extends Actor {
  constructor(position: Point) {
    super(position, 'None', 99 ** 99);
  }

  draw(ctx: CanvasRenderingContext2D, delta: number) {
    const fps = (1 / delta).toFixed(0);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`${fps}FPS`, this.position.x, this.position.y);
  }
}
