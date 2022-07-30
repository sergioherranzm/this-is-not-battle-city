import { Actor } from './Actor';
import { Point } from '../types/Point';
import { checkMapLimits, checkMoveCollisions, checkFreeSpawn } from '../utils/checkCollisions';
import { SpawnPlayerP1 } from '../actors/MapBlockClasses';
import { CarKeys, KeyboardMap } from '../utils/keyboardMap';
import { actors } from '../script';
import { Bullet } from './Bullet';
import sprite_1 from '../assets/actors/Player_Tank_A.png'
import sprite_2 from '../assets/actors/Player_Tank_B.png'
import sprite_explosion from '../assets/actors/explosion.png'
import { Timer } from '../types/Timer';
const audioURLShot = new URL('../assets/sounds/shot.mp3', import.meta.url)
const audioURLIdle = new URL('../assets/sounds/motor_idle.mp3', import.meta.url)
const audioURLAcc = new URL('../assets/sounds/motor_acc.mp3', import.meta.url)
const audioURLLoseLive = new URL('../assets/sounds/hit_player.mp3', import.meta.url)
const audioURLRespawn = new URL('../assets/sounds/appear_player.mp3', import.meta.url)


export class PlayerTank extends Actor {
  tankDrawAngle: number;
  tankAngle: number;
  tankSpeed: number;
  tankMaxSpeed: number;
  pressedKeys: string[];
  keyboardMap: KeyboardMap;
  actorSprite: HTMLImageElement;
  activeSprite: string;
  timerTankMove: Timer;
  timerShoot: Timer;
  audioShot: HTMLAudioElement;
  audioIdle: HTMLAudioElement;
  audioAcc: HTMLAudioElement;
  respawnTimer: Timer;
  audioRespawn: HTMLAudioElement;
  tankSpawnPoint: SpawnPlayerP1;

  loseLiveSprite: HTMLImageElement;
  loseLiveFrame: number;
  loseLiveTimer: Timer;
  audioLoseLive: HTMLAudioElement;

  tankDefaultMaxSpeed: number;
  tankDefaultAngleSpeed: number;

  constructor(position: Point, health: number, angle: number, keyboardMap: KeyboardMap) {
    super(position, 'Friend', health, true, true, true);
    this.size = { width: 73, height: 85 };
    this.tankDefaultAngleSpeed = 500;
    this.tankDefaultMaxSpeed = 300;
    this.tankDrawAngle = angle;
    this.tankAngle = this.tankDrawAngle;
    this.pressedKeys = [];
    this.tankSpeed = 0;
    this.tankMaxSpeed = 0;
    this.keyboardMap = keyboardMap;
    this.newPos = position;
    this.newPosGuess = position;
    this.respawnTimer = { time: -3, active: true };
    this.tankSpawnPoint = actors.find((act): act is SpawnPlayerP1 => (act instanceof SpawnPlayerP1)) as SpawnPlayerP1;

    this.actorSprite = new Image();
    this.actorSprite.src = sprite_1;
    this.activeSprite = 'sprite_1';
    this.timerTankMove = { active: true, time: 0 };
    this.timerShoot = { active: true, time: 0 };

    this.loseLiveSprite = new Image();
    this.loseLiveSprite.src = sprite_explosion;
    this.loseLiveFrame = 0;
    this.loseLiveTimer = { active: false, time: 0 };

    this.audioShot = new Audio(audioURLShot.toString());
    this.audioIdle = new Audio(audioURLIdle.toString());
    this.audioIdle.loop = true;
    this.audioAcc = new Audio(audioURLAcc.toString());
    this.audioAcc.loop = true;
    this.audioLoseLive = new Audio(audioURLLoseLive.toString());
    this.audioRespawn = new Audio(audioURLRespawn.toString());
    this.audioShot.volume = 1;
    this.audioIdle.volume = 0.2;
    this.audioLoseLive.volume = 0.4;
    this.audioRespawn.volume = 0.3;
  }

  update(delta: number): void {

    //Update timers
    if (this.timerTankMove.active === true) {
      this.timerTankMove.time += delta;
    };

    if (this.timerShoot.active === true) {
      this.timerShoot.time += delta;
    };

    if (this.loseLiveTimer.active === true) {
      this.loseLiveTimer.time += delta;
    }

    if (this.respawnTimer.active === true) {

      this.respawnTimer.time += delta;

      if (this.respawnTimer.time > 3) {
        this.respawnTimer.active = false;
        this.respawnTimer.time = 0;
      };

    };

    if (this.loseLiveTimer.active === true || this.respawnTimer.active === true) {
      this.bulletImpactDamage = false;
    } else {
      this.bulletImpactDamage = true;
    };

    if (this.loseLiveTimer.active === true) {
      this.actorCollisions = false;
      this.bulletImpact = false;
    } else {
      this.actorCollisions = true;
      this.bulletImpact = true;
    };


    //Check life
    if (this.health <= 0) { //Si esta muerto:

      const actorToRemove = actors.indexOf(this);
      actors.splice(actorToRemove, 1);


    } else if (this.loseLiveTimer.active == true) {//Ha perdido vida:

      if (this.loseLiveTimer.time > 0.2) {
        this.loseLiveFrame++;
        this.loseLiveTimer.time = 0;
      }

      if (this.loseLiveFrame === 0) {
        this.audioLoseLive.load();
        this.audioLoseLive.play();

      } else if (this.loseLiveFrame >= 8) {

        if (!checkFreeSpawn(this.tankSpawnPoint)) {
          this.loseLiveTimer.active = false;
          this.loseLiveTimer.time = 0;
          this.loseLiveFrame = 0;
          this.position = this.tankSpawnPoint.position;
          this.tankAngle = -Math.PI / 2
          this.respawnTimer.active = true;
          this.respawnTimer.time = 0;
          this.audioRespawn.load();
          this.audioRespawn.play();
        }

      };

    } else {//Si esta vivo y no ha perdido vida:

      this.checkPressedKeys()

      if (this.tankDrawAngle !== this.tankAngle) {
        //Funcion para que el angulo de dibujado cmbie suavemente al nuevo ángulo
        //this.angle += this.angleSpeed * delta;
      }
      if (this.tankDrawAngle === 2 * Math.PI) {
        this.tankDrawAngle = 0
      }

      this.tankSpeed = this.tankSpeed * 0.3 + this.tankMaxSpeed;
      if (this.tankSpeed < 0.1) {
        this.tankSpeed = 0
      };

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
      };

      //Animation
      if (this.tankSpeed > 0 && this.timerTankMove.time > 0.06) {

        if (this.activeSprite === 'sprite_1') {
          this.actorSprite.src = sprite_2;
          this.activeSprite = 'sprite_2';
        } else if (this.activeSprite === 'sprite_2') {
          this.actorSprite.src = sprite_1;
          this.activeSprite = 'sprite_1';
        };
        this.timerTankMove.time = 0;
      };

      if (this.tankSpeed === 0) {
        this.audioIdle.play();
        this.audioAcc.pause();
        this.audioAcc.load();
      };
      if (this.tankMaxSpeed > 0) {
        this.audioAcc.volume = 0.1;
        this.audioAcc.play();
      } else {
        this.audioAcc.volume = this.audioAcc.volume * 0.9;
      };

    };
  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void {

    if (this.loseLiveTimer.active === true) { //Animacion de explosion
      ctx.translate(this.position.x, this.position.y);
      ctx.drawImage(this.loseLiveSprite, this.loseLiveFrame * 256, 0, 256, 256, - this.size.width / 2, - this.size.height / 2, this.size.width, this.size.height)
    } else {

      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.tankAngle + Math.PI / 2);
      ctx.drawImage(this.actorSprite, - this.size.width / 2, - this.size.height / 2, this.size.width, this.size.height);

      ctx.fillStyle = "rgba(0, 0, 255, 0.4)";
      if (this.respawnTimer.active === true && this.respawnTimer.time % 0.2 > 0.1) { //Animacion de inmunidad
        ctx.fillRect(-this.size.width / 2, - this.size.height / 2, this.size.width, this.size.height);
      };
    };
  };

  checkPressedKeys() {
    if (this.pressedKeys.length === 0) {
      this.tankMaxSpeed = 0;
    } else {
      this.tankMaxSpeed = this.tankDefaultMaxSpeed
      if (this.pressedKeys[0] === 'left') {
        this.tankAngle = Math.PI;
      } else if (this.pressedKeys[0] === 'right') {
        this.tankAngle = 0;
      } else if (this.pressedKeys[0] === 'up') {
        this.tankAngle = -Math.PI / 2;
      } else if (this.pressedKeys[0] === 'down') {
        this.tankAngle = Math.PI / 2;
      };
    };
  };

  keyboard_event_down(key: string): void {
    if (this.loseLiveTimer.active === false) {
      const mappedKey = this.keyboardMap[key];
      if (mappedKey === CarKeys.LEFT) {
        if (!this.pressedKeys.some(i => (i === 'left'))) {
          this.pressedKeys.push('left')
        };
        this.audioIdle.load();
      } else if (mappedKey === CarKeys.RIGHT) {
        if (!this.pressedKeys.some(i => (i === 'right'))) {
          this.pressedKeys.push('right')
        };
        this.audioIdle.load();
      } else if (mappedKey === CarKeys.UP) {
        if (!this.pressedKeys.some(i => (i === 'up'))) {
          this.pressedKeys.push('up')
        };
        this.audioIdle.load();
      } else if (mappedKey === CarKeys.DOWN) {
        if (!this.pressedKeys.some(i => (i === 'down'))) {
          this.pressedKeys.push('down')
        };
        this.audioIdle.load();
      } else if (mappedKey === CarKeys.FIRE) {
        if (this.timerShoot.time > 0.25) {
          this.audioShot.load();
          actors.push(new Bullet({ x: this.position.x + (this.size.width / 2 * Math.cos(this.tankAngle)), y: this.position.y + (this.size.height / 2 * Math.sin(this.tankAngle)) }, 'Friend', 1, this.tankAngle, this));
          this.audioShot.play();
          this.timerShoot.time = 0;
        };

      };
    };
  };

  keyboard_event_up(key: string): void {
    const mappedKey = this.keyboardMap[key];
    if (mappedKey === CarKeys.LEFT) {
      this.pressedKeys.splice(this.pressedKeys.indexOf('left'), 1);
    } else if (mappedKey === CarKeys.RIGHT) {
      this.pressedKeys.splice(this.pressedKeys.indexOf('right'), 1);
    } else if (mappedKey === CarKeys.UP) {
      this.pressedKeys.splice(this.pressedKeys.indexOf('up'), 1);
    } else if (mappedKey === CarKeys.DOWN) {
      this.pressedKeys.splice(this.pressedKeys.indexOf('down'), 1);
    };
  };


  /*
    keyboard_event_down(key: string): void {
      if (this.loseLiveTimer.active === false) {
        const mappedKey = this.keyboardMap[key];
        if (mappedKey === CarKeys.LEFT) {
          this.tankAngle = Math.PI;
          this.tankMaxSpeed = this.tankDefaultMaxSpeed
          this.audioIdle.load();
        } else if (mappedKey === CarKeys.RIGHT) {
          this.tankAngle = 0;
          this.tankMaxSpeed = this.tankDefaultMaxSpeed;
          this.audioIdle.load();
        } else if (mappedKey === CarKeys.UP) {
          this.tankAngle = -Math.PI / 2;
          this.tankMaxSpeed = this.tankDefaultMaxSpeed;
          this.audioIdle.load();
        } else if (mappedKey === CarKeys.DOWN) {
          this.tankAngle = Math.PI / 2;
          this.tankMaxSpeed = this.tankDefaultMaxSpeed;
          this.audioIdle.load();
        } else if (mappedKey === CarKeys.FIRE) {
          this.audioShot.load()
          actors.push(new Bullet({ x: this.position.x + (this.size.width / 2 * Math.cos(this.tankAngle)), y: this.position.y + (this.size.height / 2 * Math.sin(this.tankAngle)) }, 'Friend', 1, this.tankAngle, this))
          this.audioShot.play()
        };
      };
    };
  
    keyboard_event_up(key: string): void {
      const mappedKey = this.keyboardMap[key];
      if (mappedKey === CarKeys.UP || mappedKey === CarKeys.DOWN || mappedKey === CarKeys.LEFT || mappedKey === CarKeys.RIGHT) {
        this.tankMaxSpeed = 0;
      };
    };
    */
};
