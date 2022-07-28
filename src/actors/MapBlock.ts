import { Actor } from './Actor';
import { Point } from '../types/Point';
import { actors } from '../script';


export class MapBlock extends Actor {
  actorSprite: HTMLImageElement;

  constructor(position: Point, health: number, sprite: string, collisions: boolean, bulletImpact: boolean, bulletImpactDamage: boolean) {
    super(position, 'None', health, collisions, bulletImpact, bulletImpactDamage);
    this.size = { width: 100, height: 100 };
    this.actorSprite = new Image();
    this.actorSprite.src = sprite;
  };

  update(delta: number): void {

  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void {

    ctx.translate(this.position.x, this.position.y);
    ctx.drawImage(this.actorSprite, - this.size.width / 2, - this.size.height / 2, this.size.width, this.size.height)

    /*
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;

    ctx.fillRect(this.position.x - this.size.width / 2, this.position.y - this.size.height / 2, this.size.width, this.size.height);
    */
  };

};
