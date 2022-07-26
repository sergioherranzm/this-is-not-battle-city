import { Point } from '../types/Point';
import { Size } from '../types/Size';

export interface IGUIItem {
  position: Point;
  size: Size;
  draw: (ctx: CanvasRenderingContext2D, delta: number) => void;
  update: (delta: number) => void;
}

export class GUIItem implements IGUIItem {
  position: Point;
  size: Size;
  constructor(position: Point, size: Size) {
    this.position = position;
    this.size = size
  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void { };

  update(delta: number): void { };

};