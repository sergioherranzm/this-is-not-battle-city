import { Actor } from './Actor';
import { Point } from '../types/Point';
import { checkMapLimits, checkMoveCollisions } from '../utils/checkCollisions';
import { actors } from '../script';
import { Bullet } from './Bullet';
import lodash from 'lodash';
import { Timer } from '../types/Timer';
import sprite_explosion from '../assets/actors/explosion.png';
import { gameGUI } from '../script';
const audioURLDeath = new URL('../assets/sounds/enemy_death.mp3', import.meta.url);

export class EnemyTank extends Actor {
  tankDrawAngle: number;
  tankAngle: number;
  tankSpeed: number;
  tankMaxSpeed: number;
  timerShoot: Timer;
  tankshootSpeed: number;
  tankScore: number;
  timerChangeDirection: Timer;
  bulletPower: number;
  actorSprite: HTMLImageElement;
  actorSpriteString_1: string;
  actorSpriteString_2: string;
  activeSprite: string;
  timerTankMove: Timer;
  deathSprite: HTMLImageElement;
  deathFrame: number;
  deathTimer: Timer;
  audioDeath: HTMLAudioElement;

  tankDefaultMaxSpeed: number;
  tankDefaultAngleSpeed: number;

  constructor(position: Point, angle: number, health: number, sprite_1: string, sprite_2: string, speed: number, bulletPower: number, shootSpeed: number, score: number) {
    super(position, 'Foe', health, true, true, true);
    this.size = { width: 85, height: 85 };
    this.tankDefaultAngleSpeed = 500;

    this.tankDefaultMaxSpeed = speed;
    this.bulletPower = bulletPower;

    this.tankshootSpeed = shootSpeed;
    this.tankScore = score;

    this.tankDrawAngle = angle;
    this.tankAngle = this.tankDrawAngle;
    this.tankSpeed = 0;
    this.tankMaxSpeed = this.tankDefaultMaxSpeed;
    this.newPos = position;
    this.newPosGuess = position;

    this.timerShoot = { active: true, time: 0 };
    this.timerChangeDirection = { active: true, time: 0 };

    this.actorSpriteString_1 = sprite_1;
    this.actorSpriteString_2 = sprite_2;
    this.activeSprite = 'sprite_1';
    this.actorSprite = new Image();
    this.actorSprite.src = sprite_1;
    this.timerTankMove = { active: true, time: 0 };

    this.deathSprite = new Image();
    this.deathSprite.src = sprite_explosion;
    this.deathFrame = 0;
    this.deathTimer = { active: false, time: 0 };

    this.audioDeath = new Audio(audioURLDeath.toString());
    this.audioDeath.volume = 0.15;
  }

  update(delta: number): void {

    //Update timers
    if (this.timerTankMove.active === true) {
      this.timerTankMove.time += delta;
    };
    if (this.deathTimer.active === true) {
      this.deathTimer.time += delta;
    };
    if (this.timerShoot.active === true) {
      this.timerShoot.time += delta;
    };
    if (this.timerChangeDirection.active === true) {
      this.timerChangeDirection.time += delta;
    };

    //Check life
    if (this.health <= 0) { //Si esta muerto:
      this.deathTimer.active = true;

      if (this.deathTimer.time > 0.04) {
        this.deathFrame++;
        this.deathTimer.time = 0;
      };

      if (this.deathFrame === 0) {
        this.audioDeath.load();
        this.audioDeath.play();
        this.actorCollisions = false;
        this.bulletImpact = false;
        this.bulletImpactDamage = false;
      } else if (this.deathFrame === 8) {
        gameGUI.score += this.tankScore;
        const actorToRemove = actors.indexOf(this);
        actors.splice(actorToRemove, 1);
      };

    } else { //Si esta vivo:

      //Funcion de cambio de direccion aleatorio en funcion de cierta probabilidad
      let probabilityChange = lodash.random(0, 99);
      if (probabilityChange > 97 && this.timerChangeDirection.time > 1) {
        this.getNewRandomDirection();
        this.timerChangeDirection.time = 0;
      };

      //Funcion para que el angulo de dibujado cambie suavemente al nuevo ángulo*****************
      /*
      if (this.tankDrawAngle !== this.tankAngle) {
        //this.angle += this.angleSpeed * delta;
      };
      if (this.tankDrawAngle === 2 * Math.PI) {
        this.tankDrawAngle = 0;
      };
      */

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

      // Check collisions
      if (checkMapLimits(this.newPos, this.size) && !checkMoveCollisions(this)) {
        this.position = this.newPos;
      } else {
        this.tankMaxSpeed = 0;
        this.getNewRandomDirection();
      };

      // Funcion de disparo automático cada x segundos
      if (this.timerShoot.time > this.tankshootSpeed) {
        this.timerShoot.time = 0;
        actors.push(new Bullet({ x: this.position.x + (this.size.width / 2 * Math.cos(this.tankAngle)), y: this.position.y + (this.size.height / 2 * Math.sin(this.tankAngle)) }, 'Foe', this.bulletPower, this.tankAngle, this));
      };

      //Animation
      if (this.tankSpeed > 0 && this.timerTankMove.time > 0.06) {
        if (this.activeSprite === 'sprite_1') {
          this.actorSprite.src = this.actorSpriteString_2;
          this.activeSprite = 'sprite_2';
        } else if (this.activeSprite === 'sprite_2') {
          this.actorSprite.src = this.actorSpriteString_1;
          this.activeSprite = 'sprite_1';
        };
        this.timerTankMove.time = 0;
      };
    };
  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void {

    if (this.health <= 0) {
      ctx.translate(this.position.x, this.position.y);
      ctx.drawImage(this.deathSprite, this.deathFrame * 256, 0, 256, 256, - this.size.width / 2, - this.size.height / 2, this.size.width, this.size.height);
    } else {
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.tankAngle + Math.PI / 2);
      ctx.drawImage(this.actorSprite, - this.size.width / 2, - this.size.height / 2, this.size.width, this.size.height);
    };

  };

  getNewRandomDirection(): void {
    const directions: number[] = [0, Math.PI / 2, Math.PI, -Math.PI / 2];

    let newDirection = directions[lodash.random(0, 3)];
    while (newDirection === this.tankAngle) {
      newDirection = directions[lodash.random(0, 3)];
    };
    this.tankAngle = newDirection;

    this.tankMaxSpeed = this.tankDefaultMaxSpeed;
  };
};