import { Point } from '../types/Point';
import { Timer } from '../types/Timer';
import { GUIItem } from './GUIItem';
import sprite from '../assets/GUI.png';


export class GUIEnemy extends GUIItem {
  timer: Timer;
  image: HTMLImageElement;
  xFrame: number;

  constructor(position: Point) {
    super(position, { width: 62, height: 90 });
    this.timer = { time: 0, active: true };
    this.image = new Image();
    this.image.src = sprite;
    this.xFrame = 1;
  };

  update(delta: number): void {
    //Animacion
    this.timer.time += delta;
    if (this.timer.time >= 0.15) {
      this.xFrame = (this.xFrame + 1) % 3;
      this.timer.time = 0;
    };
  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void {

    ctx.drawImage(
      this.image,
      2 + (this.xFrame * 15),
      141,
      11,
      16,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  };
};