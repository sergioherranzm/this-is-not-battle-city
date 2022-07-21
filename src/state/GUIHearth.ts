import { Point } from '../types/Point';
import { Timer } from '../types/Timer';
import { GUIItem } from './GUIItem'
//import sprite from '../assets/atlas.png'


export class GUIHearth extends GUIItem {
  //timer: Timer;
  //image: HTMLImageElement;

  constructor(position: Point) {
    super(position, { width: 30, height: 30 });
    //this.timer = { time: 0, active: true };
    //this.image = new Image();
    //this.image.src = sprite;
  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);

  };

  update(delta: number): void {
    //actualizar sprite
  };

};