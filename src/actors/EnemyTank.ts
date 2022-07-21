import { Actor } from './Actor';
import { Point } from '../types/Point';
import { Size } from '../types/Size';
import { checkMapLimits, checkMoveCollisions } from '../utils/checkCollisions';
import { actors } from '../script';
import { Bullet } from './Bullet';
import lodash from 'lodash'

export class EnemyTank extends Actor {
  tankColor: string;
  tankDrawAngle: number;
  tankAngle: number;
  tankSpeed: number;
  tankMaxSpeed: number;
  timerShoot: number;
  timerChangeDirection: number;
  bulletPower: number;

  tankDefaultMaxSpeed: number;
  tankDefaultAngleSpeed: number;

  constructor(position: Point, angle: number, health: number, sprite: string, speed: number, bulletPower: number) {
    super(position, 'Foe', health);
    this.size = { width: 100, height: 100 };
    this.tankDefaultAngleSpeed = 500;

    this.tankColor = sprite;
    this.tankDefaultMaxSpeed = speed;
    this.bulletPower = bulletPower;

    this.tankDrawAngle = angle;
    this.tankAngle = this.tankDrawAngle;
    this.tankSpeed = 0;
    this.tankMaxSpeed = this.tankDefaultMaxSpeed;
    this.newPos = position;
    this.newPosGuess = position;

    this.timerShoot = 0
    this.timerChangeDirection = 0
  }

  update(delta: number): void {

    if (this.health <= 0) {
      const actorToRemove = actors.indexOf(this)
      actors.splice(actorToRemove, 1)
      console.log('¡Enemigo eliminado!')
    }

    if (this.tankDrawAngle !== this.tankAngle) {
      //Funcion para que el angulo de dibujado cmbie suavemente al nuevo ángulo*****************
      //this.angle += this.angleSpeed * delta;
    }
    if (this.tankDrawAngle === 2 * Math.PI) {
      this.tankDrawAngle = 0
    }

    this.tankSpeed = this.tankSpeed * 0.6 + this.tankMaxSpeed;

    this.newPos = {
      x:
        this.position.x + (Math.cos(this.tankAngle) * this.tankSpeed * delta),
      y:
        this.position.y + (Math.sin(this.tankAngle) * this.tankSpeed * delta),
    };

    this.newPosGuess = {
      x:
        this.newPos.x + (Math.cos(this.tankAngle) * this.tankSpeed * delta),
      y:
        this.newPos.y + (Math.sin(this.tankAngle) * this.tankSpeed * delta),
    };


    if (checkMapLimits(this.newPos, this.size) && !checkMoveCollisions(this)) {
      this.position = this.newPos;
    } else {
      this.tankMaxSpeed = 0;
      this.getNewRandomDirection();
    }

    // Funcion de disparo automático cada x segundos
    this.timerShoot += delta
    if (this.timerShoot > 1) {
      this.timerShoot = 0
      //console.log(actors)
      actors.push(new Bullet({ x: this.position.x + (this.size.width / 2 * Math.cos(this.tankAngle)), y: this.position.y + (this.size.height / 2 * Math.sin(this.tankAngle)) }, 'Foe', this.bulletPower, this.tankAngle, this))
    }
  }

  draw(ctx: CanvasRenderingContext2D, delta: number): void {
    ctx.fillStyle = this.tankColor;
    ctx.strokeStyle = this.tankColor;
    //ctx.lineWidth = 1;

    ctx.translate(this.position.x, this.position.y);

    ctx.rotate(this.tankAngle + Math.PI / 2);

    ctx.beginPath();
    ctx.moveTo(-this.size.width / 16, -this.size.height / 2);
    ctx.lineTo(-this.size.width / 16, -this.size.height / 16)
    ctx.lineTo(-this.size.width / 2, -this.size.height / 16)
    ctx.lineTo(-this.size.width / 2, this.size.height / 2)
    ctx.lineTo(this.size.width / 2, this.size.height / 2)
    ctx.lineTo(this.size.width / 2, -this.size.height / 16)
    ctx.lineTo(this.size.width / 16, -this.size.height / 16)
    ctx.lineTo(this.size.width / 16, -this.size.height / 2)
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    //ctx.rotate(angleToRad(180)); // this is for the ferrari orientation
    /*ctx.drawImage(
      -this.carSize.height / 2,
      -this.carSize.width / 2,
      this.carSize.height,
      this.carSize.width
    );*/
  };

  getNewRandomDirection(): void {
    const directions: number[] = [0, Math.PI / 2, Math.PI, -Math.PI / 2]

    let newDirection = directions[lodash.random(0, 3)]
    while (newDirection == this.tankAngle) {
      newDirection = directions[lodash.random(0, 3)]
    }
    this.tankAngle = newDirection

    /*
        let newDirection = directions[Math.floor(Math.random() * 4)]
        while (newDirection == this.tankAngle) {
          newDirection = directions[Math.floor(Math.random() * 4)]
        }
    */
    // this.tankAngle = newDirection


    //this.tankAngle += Math.PI / 2
    this.tankMaxSpeed = this.tankDefaultMaxSpeed;
  }
}
