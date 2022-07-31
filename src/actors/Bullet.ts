import { Actor } from './Actor';
import { Point } from '../types/Point';
import { checkBulletCollisions, checkMapLimits } from '../utils/checkCollisions';
import { actors } from '../script';
import { EnemyTank } from './EnemyTank';
import { PlayerTank } from './PlayerTank';
import sprite_1 from '../assets/actors/Medium_Shell.png';
import sprite_2 from '../assets/actors/Heavy_Shell.png';

export class Bullet extends Actor {
  bulletColor: string;
  bulletAngle: number;
  bulletSpeed: number;
  shooter: EnemyTank | PlayerTank;
  actorSprite: HTMLImageElement;

  bulletDefaultSpeed: number;

  constructor(position: Point, IFF: string, health: number, direction: number, shooter: EnemyTank | PlayerTank) {
    super(position, IFF, health, false, true, true);

    if (IFF === 'Foe') {
      this.bulletColor = 'red';
    } else {
      this.bulletColor = 'orange';
    };

    this.bulletDefaultSpeed = 700;
    this.bulletAngle = direction;
    this.bulletSpeed = this.bulletDefaultSpeed;
    this.shooter = shooter;

    this.actorSprite = new Image();
    if (health > 1) {
      this.size = { width: 12, height: 38 };
      this.actorSprite.src = sprite_2;
    } else {
      this.size = { width: 12, height: 27 };
      this.actorSprite.src = sprite_1;
    };

  };

  update(delta: number): void {

    if (this.health <= 0) {
      const actorToRemove = actors.indexOf(this);
      actors.splice(actorToRemove, 1);
    };

    let newPos: Point = {
      x:
        this.position.x + (Math.cos(this.bulletAngle) * this.bulletSpeed * delta),
      y:
        this.position.y + (Math.sin(this.bulletAngle) * this.bulletSpeed * delta),
    };

    if (checkMapLimits(newPos, this.size)) {
      this.position = newPos;
    } else {
      this.health = 0;
    };

    checkBulletCollisions(this, this.shooter);
  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void {

    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.bulletAngle + Math.PI / 2);

    if (this.actorSprite.src === sprite_1) {
      ctx.drawImage(this.actorSprite, 55, 45, 17, 38, - this.size.width / 2, - this.size.height / 2, this.size.width, this.size.height);
    } else {
      ctx.drawImage(this.actorSprite, 54, 32, 20, 63, - this.size.width / 2, - this.size.height / 2, this.size.width, this.size.height);
    };
  };
};