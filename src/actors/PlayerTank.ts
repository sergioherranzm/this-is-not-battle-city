import { Actor } from './Actor';
import { Point } from '../types/Point';
import { Size } from '../types/Size';
import { checkMapLimits, checkMoveCollisions } from '../utils/checkCollisions';
import { CarKeys, KeyboardMap } from '../utils/keyboardMap';
import { actors } from '../script';
import { Bullet } from './Bullet';

export class PlayerTank extends Actor {
  tankColor: string;
  tankDrawAngle: number;
  tankAngle: number;
  tankSpeed: number;
  tankMaxSpeed: number;
  keyboardMap: KeyboardMap;

  tankDefaultMaxSpeed: number;
  tankDefaultAngleSpeed: number;

  constructor(position: Point, health: number, angle: number, keyboardMap: KeyboardMap) {
    super(position, 'Friend', health);
    this.size = { width: 100, height: 100 };
    this.tankColor = 'orange';
    this.tankDefaultAngleSpeed = 500;
    this.tankDefaultMaxSpeed = 300;
    this.tankDrawAngle = angle;
    this.tankAngle = this.tankDrawAngle;
    this.tankSpeed = 0;
    this.tankMaxSpeed = 0;
    this.keyboardMap = keyboardMap;
    this.newPos = position;
    this.newPosGuess = position;
  }

  update(delta: number): void {

    if (this.health <= 0) {
      const actorToRemove = actors.indexOf(this)
      actors.splice(actorToRemove, 1)
      console.log('¡Has muerto!\nPulsa F5 para reiniciar')
    }

    if (this.tankDrawAngle !== this.tankAngle) {
      //Funcion para que el angulo de dibujado cmbie suavemente al nuevo ángulo
      //this.angle += this.angleSpeed * delta;
    }
    if (this.tankDrawAngle === 2 * Math.PI) {
      this.tankDrawAngle = 0
    }

    this.tankSpeed = this.tankSpeed * 0.6 + this.tankMaxSpeed;
    //console.log('acc', this.tankAcceleration, 'vel', this.tankSpeed);//-----------------------------------
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
    }

  }

  draw(ctx: CanvasRenderingContext2D, delta: number): void {
    ctx.fillStyle = this.tankColor;
    ctx.strokeStyle = this.tankColor;
    //ctx.lineWidth = 1;

    ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);

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

    ctx.rect(this.position.x, this.position.y, this.size.width, this.size.height);



    //ctx.rotate(angleToRad(180)); // this is for the ferrari orientation
    /*ctx.drawImage(
      -this.carSize.height / 2,
      -this.carSize.width / 2,
      this.carSize.height,
      this.carSize.width
    );*/
  };

  keyboard_event_down(key: string): void {
    const mappedKey = this.keyboardMap[key];
    if (mappedKey === CarKeys.LEFT) {
      this.tankAngle = Math.PI;
      this.tankMaxSpeed = this.tankDefaultMaxSpeed
    } else if (mappedKey === CarKeys.RIGHT) {
      this.tankAngle = 0;
      this.tankMaxSpeed = this.tankDefaultMaxSpeed;
    } else if (mappedKey === CarKeys.UP) {
      this.tankAngle = -Math.PI / 2;
      this.tankMaxSpeed = this.tankDefaultMaxSpeed;
    } else if (mappedKey === CarKeys.DOWN) {
      this.tankAngle = Math.PI / 2;
      this.tankMaxSpeed = this.tankDefaultMaxSpeed;
    } else if (mappedKey === CarKeys.FIRE) {
      actors.push(new Bullet({ x: this.position.x + (this.size.width / 2 * Math.cos(this.tankAngle)), y: this.position.y + (this.size.height / 2 * Math.sin(this.tankAngle)) }, 'Friend', 1, this.tankAngle, this))
    };
  };

  keyboard_event_up(key: string): void {
    const mappedKey = this.keyboardMap[key];
    if (mappedKey === CarKeys.UP || mappedKey === CarKeys.DOWN || mappedKey === CarKeys.LEFT || mappedKey === CarKeys.RIGHT) {
      this.tankMaxSpeed = 0;
    };
  };
}
