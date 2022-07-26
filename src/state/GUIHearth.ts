import { Point } from '../types/Point';
import { Timer } from '../types/Timer';
import { GUIItem } from './GUIItem'
import sprite from '../assets/GUI.png'


export class GUIHearth extends GUIItem {
  timer: Timer;
  image: HTMLImageElement;
  xFrame: number;

  constructor(position: Point) {
    super(position, { width: 60, height: 100 });
    this.timer = { time: 0, active: true };
    this.image = new Image();
    this.image.src = sprite;
    this.xFrame = 0;
  };

  update(delta: number): void {
    //Animacion
    this.timer.time += delta
    if (this.timer.time >= 0.08) {
      this.xFrame = (this.xFrame + 1) % 9;
      this.timer.time = 0
    };
  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void {

    ctx.drawImage(
      this.image,
      22 + (this.xFrame * 10),
      75,
      9,
      15,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    )

    //ctx.fillStyle = 'red';
    //ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

  };

};