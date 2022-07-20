import { Actor } from './Actor';
import { Point } from '../types/Point';
import { Size } from '../types/Size';
import { checkBulletCollisions, checkMapLimits } from '../utils/checkCollisions';
import { actors } from '../script';

export class Bullet extends Actor {
  bulletColor: string;
  bulletAngle: number;
  bulletSpeed: number;

  bulletDefaultSpeed: number;

  constructor(position: Point, IFF: string, health: number, direction: number) {
    super(position, IFF, health);
    this.size = { width: 20, height: 20 };
    if (IFF === 'Foe') {
      this.bulletColor = 'red';
    } else {
      this.bulletColor = 'orange';
    }

    this.bulletDefaultSpeed = 700;
    this.bulletAngle = direction;
    this.bulletSpeed = this.bulletDefaultSpeed;
    //console.log('vida', health)
  }

  update(delta: number): void {

    if (this.health <= 0) {
      const actorToRemove = actors.indexOf(this)
      actors.splice(actorToRemove, 1)
    }

    let newPos: Point = {
      x:
        this.position.x + (Math.cos(this.bulletAngle) * this.bulletSpeed * delta),
      y:
        this.position.y + (Math.sin(this.bulletAngle) * this.bulletSpeed * delta),
    };

    if (checkMapLimits(newPos, this.size)) {
      this.position = newPos;
    } else {
      //console.log(actors.indexOf(this))
      this.health = 0
    }

    checkBulletCollisions(this)
  }

  draw(ctx: CanvasRenderingContext2D, delta: number): void {
    ctx.fillStyle = this.bulletColor;
    ctx.strokeStyle = this.bulletColor;
    //ctx.lineWidth = 1;

    ctx.translate(this.position.x, this.position.y);

    ctx.rotate(this.bulletAngle + Math.PI / 2);

    ctx.fillRect(-this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height)
    /*
    ctx.beginPath();
    ctx.moveTo(-this.bulletSize.width / 16, -this.bulletSize.height / 2);
    ctx.lineTo(-this.bulletSize.width / 16, -this.bulletSize.height / 3)
    ctx.lineTo(-this.bulletSize.width / 2, -this.bulletSize.height / 3)
    ctx.lineTo(-this.bulletSize.width / 2, this.bulletSize.height / 2)
    ctx.lineTo(this.bulletSize.width / 2, this.bulletSize.height / 2)
    ctx.lineTo(this.bulletSize.width / 2, -this.bulletSize.height / 3)
    ctx.lineTo(this.bulletSize.width / 16, -this.bulletSize.height / 3)
    ctx.lineTo(this.bulletSize.width / 16, -this.bulletSize.height / 2)
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    */
    //ctx.rotate(angleToRad(180)); // this is for the ferrari orientation
    /*ctx.drawImage(
      -this.carSize.height / 2,
      -this.carSize.width / 2,
      this.carSize.height,
      this.carSize.width
    );*/
  };

}
