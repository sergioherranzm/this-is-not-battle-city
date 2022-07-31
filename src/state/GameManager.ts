import { IGUIItem } from './GUIItem';
import { GUIHearth } from './GUIHearth';
import { GUIEnemy } from './GUIEnemy';
import { actors } from '../script';
import { MapBuilder, chosenLevel } from './MapBuilder';
import { SpawnPlayerP1 } from '../actors/MapBlockClasses';
import { PlayerTank } from '../actors/PlayerTank';
import { EnemyTank } from '../actors/EnemyTank';
import { Timer } from '../types/Timer';
import { MAP_P1, MAP_P2 } from '../utils/keyboardMap';
const audioURLWin = new URL('../assets/sounds/win.mp3', import.meta.url);
const audioURLLose = new URL('../assets/sounds/lose.mp3', import.meta.url);

export interface IGameManager {
  livesP1: number;
  livesP2?: number;
  chrono: Timer;
  level: string;
  enemies: number;
  score: number;
  FPS: number;
  aHearthsP1: IGUIItem[];
  aHearthsP2?: IGUIItem[];
  aEnemies: IGUIItem[];
  backgroundSprite: HTMLImageElement;
  pause: boolean;
  winState: boolean;
  loseState: boolean;
  //escapeState: boolean;
  audioWin: HTMLAudioElement;
  audioWinPlayed: boolean;
  audioLose: HTMLAudioElement;
  audioLosePlayed: boolean;
  draw: (ctx: CanvasRenderingContext2D, delta: number) => void;
  update: (delta: number) => void;
  paintBackground: (ctx: CanvasRenderingContext2D) => void;
};

export class GameManager implements IGameManager {
  livesP1: number;
  livesP2?: number;
  chrono: Timer;
  level: string;
  enemies: number;
  score: number;
  FPS: number;
  aHearthsP1: IGUIItem[];
  aHearthsP2?: IGUIItem[];
  aEnemies: IGUIItem[];
  backgroundSprite: HTMLImageElement;
  pause: boolean;
  winState: boolean;
  loseState: boolean;
  //escapeState: boolean;
  audioWin: HTMLAudioElement;
  audioWinPlayed: boolean;
  audioLose: HTMLAudioElement;
  audioLosePlayed: boolean;

  constructor(level: string) {

    this.livesP1 = 0;
    this.chrono = { time: 0, active: false };
    this.level = level;
    this.enemies = 0;
    this.score = 0;
    this.FPS = 0;

    this.aHearthsP1 = [];
    this.aEnemies = [];

    this.pause = false;
    this.winState = false;
    this.loseState = false;
    //this.escapeState = false;

    this.audioWin = new Audio(audioURLWin.toString());
    this.audioWin.volume = 0.5;
    this.audioWinPlayed = false;
    this.audioLose = new Audio(audioURLLose.toString());
    this.audioLose.volume = 0.5;
    this.audioLosePlayed = false;

    MapBuilder(+this.level);

    this.backgroundSprite = new Image();
    this.backgroundSprite.src = chosenLevel.background;

    const SpawnP1: SpawnPlayerP1 = actors.find((act): act is SpawnPlayerP1 => (act instanceof SpawnPlayerP1)) as SpawnPlayerP1;
    actors.push(new PlayerTank(SpawnP1.position, 3, -Math.PI / 2, MAP_P1));

  };

  update(delta: number): void {
    if (this.chrono.active === true) {
      this.chrono.time += delta;
    };

    //Lives
    const actorsOnlyPlayers = actors.filter(act => (act instanceof PlayerTank)) as PlayerTank[];
    for (let i = 0; i <= actorsOnlyPlayers.length - 1; i++) {
      if (actorsOnlyPlayers[i].keyboardMap === MAP_P1) {
        this.livesP1 = actorsOnlyPlayers[i].health;
        if (actorsOnlyPlayers[i].health <= 0) {
          this.loseState = true;
        };
      } /*else if (actorsOnlyPlayers[i].keyboardMap === MAP_P2) {
        this.livesP2 = actorsOnlyPlayers[i].health;
      };*/

    };

    if (this.livesP1 < this.aHearthsP1.length) {
      for (let i = this.aHearthsP1.length; i > this.livesP1; i--) {
        this.aHearthsP1.pop();
      };
    } else if (this.livesP1 > this.aHearthsP1.length) {
      for (let i = this.aHearthsP1.length; i < this.livesP1; i++) {
        this.aHearthsP1.push(new GUIHearth({ x: 0, y: 0 }));
      };
      this.aHearthsP1.forEach((h, i) => {
        h.position = { x: 20 + (60 * i), y: 80 };
      });
    };

    //Enemies
    const actorsOnlyEnemies = actors.filter(act => (act instanceof EnemyTank)) as EnemyTank[];

    if (actorsOnlyEnemies.length < this.aEnemies.length) {
      for (let i = this.aEnemies.length; i > actorsOnlyEnemies.length; i--) {
        this.aEnemies.pop();
      };
    } else if (actorsOnlyEnemies.length > this.aEnemies.length) {
      for (let i = this.aEnemies.length; i < actorsOnlyEnemies.length; i++) {
        this.aEnemies.push(new GUIEnemy({ x: 0, y: 0 }));
      };
      this.aEnemies.forEach((h, i) => {
        h.position = { x: 1220 - (70 * i), y: 85 };
      });
    };

    if (actorsOnlyEnemies.length === 0) {
      this.winState = true;
      //actors.length = 0;
    };

    if (this.loseState === true || this.winState === true) {
      this.chrono.active = false;
      actors.filter((act): act is PlayerTank => (act instanceof PlayerTank)).forEach((t) => {
        t.audioIdle.load();
        t.audioAcc.load();
        t.audioShot.load();
      });
    };

    if (this.loseState === true && this.audioLosePlayed === false) {
      this.audioLose.play();
      this.audioLosePlayed = true;
    } else if (this.winState === true && this.audioWinPlayed === false) {
      this.audioWin.play();
      this.audioWinPlayed = true;
    };

  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void {

    if (this.loseState === true) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = 'white';
      ctx.direction = 'ltr';
      ctx.font = '600 120px Verdana';
      ctx.fillText(`YOU LOSE!`, 300, 450);
      ctx.font = 'bold 90px Verdana';
      ctx.fillText(`SCORE: ${this.score}`, 360, 750);
      ctx.font = '50px Verdana';
      ctx.fillText(`Press ESC to continue...`, 350, 1400);

    } else if (this.winState === true) {
      this.aHearthsP1.forEach((h, i) => {
        h.position = { x: 630 + (60 * i), y: 845 };
      });
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = 'white';
      ctx.direction = 'ltr';
      ctx.font = '600 120px Verdana';
      ctx.fillText(`YOU WIN!`, 310, 350);
      ctx.font = 'bold 80px Verdana';
      ctx.fillText(`SCORE`, 480, 600);
      ctx.font = 'bold 60px Verdana';
      ctx.fillText(`TANK: ${this.score}`, 400, 710);
      ctx.fillText(`TIME: ${this.chrono.time.toFixed(0)}`, 412, 810);
      ctx.fillText(`LIFE:`, 432, 920);
      ctx.font = 'bold 90px Verdana';
      ctx.fillText(`TOTAL SCORE: ${((this.livesP1 * 100) + this.score + (120 - this.chrono.time)).toFixed(0)}`, 180, 1160);
      ctx.font = '50px Verdana';
      ctx.fillText(`Press ESC to continue...`, 350, 1400);

      //Lives
      this.aHearthsP1.forEach((h) => {
        h.update(delta);
        h.draw(ctx, delta);
      });

    } else {
      ctx.fillStyle = 'white';
      ctx.direction = 'ltr';

      //FPSviewer
      const fps = (1 / delta).toFixed(0);
      ctx.font = '26px Verdana';
      ctx.fillText(`${fps} FPS`, 600, 30);

      //Labels
      ctx.fillStyle = 'white';
      ctx.font = 'bold 60px Verdana';

      //Level
      ctx.fillText(`LEVEL`, 550, 100);

      if (+this.level >= 0) {
        ctx.fillText(`${this.level}`, 630, 170);
      } else {
        ctx.fillText(`RANDOM`, 510, 170);
      };

      //Chrono
      ctx.fillText(`TIME: ${this.chrono.time.toFixed(0)}`, 10, 60);

      //Score
      ctx.direction = 'rtl';
      ctx.fillText(`SCORE: ${this.score}`, 1280, 60);
      ctx.direction = 'ltr';

      //Enemies
      this.aEnemies.forEach((h) => {
        h.update(delta);
        h.draw(ctx, delta);
      });

      //PAUSE
      if (this.pause === true) {
        ctx.fillStyle = 'white';
        ctx.direction = 'ltr';
        ctx.font = '600 200px Verdana';
        ctx.fillText(`PAUSE`, 300, 850);
      };

      //Lives
      this.aHearthsP1.forEach((h) => {
        h.update(delta);
        h.draw(ctx, delta);
      });
    };
  };

  paintBackground(ctx: CanvasRenderingContext2D): void {

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, 200);

    for (let y = 200; y < ctx.canvas.height; y += 200) {
      for (let x = 0; x < ctx.canvas.width; x += 200) {
        ctx.drawImage(this.backgroundSprite, x, y, 200, 200);
      };
    };
  };
};