import { Point } from '../types/Point';
import { IGUIItem } from './GUIItem';
import { GUIHearth } from './GUIHearth';
import { GUIEnemy } from './GUIEnemy';
import { actors } from '../script'
import { MapBuilder } from './MapBuilder'
import { PlayerTank } from '../actors/PlayerTank';
import { EnemyTank } from '../actors/EnemyTank';
import { Timer } from '../types/Timer';
import { MAP_P1, MAP_P2 } from '../utils/keyboardMap';
import backgroundSpriteFile from '../assets/background/Ground_Tile_01_B.png'

interface IGameManager {
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
  draw: (ctx: CanvasRenderingContext2D, delta: number) => void;
  update: (delta: number) => void;
  paintBackground: (ctx: CanvasRenderingContext2D) => void;
}

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

  constructor() {

    this.livesP1 = 0;
    this.chrono = { time: 0, active: true }
    this.level = '1';
    this.enemies = 0;
    this.score = 0;
    this.FPS = 0;

    MapBuilder(+this.level)

    this.aHearthsP1 = []
    this.aEnemies = []

    this.backgroundSprite = new Image();
    this.backgroundSprite.src = backgroundSpriteFile;

    this.pause = false;
  }

  update(delta: number): void {
    if (this.chrono.active === true) {
      this.chrono.time += delta;
    }

    //Lives
    const actorsOnlyPlayers = actors.filter(act => (act instanceof PlayerTank)) as PlayerTank[]
    for (let i = 0; i <= actorsOnlyPlayers.length - 1; i++) {
      if (actorsOnlyPlayers[i].keyboardMap === MAP_P1) {
        this.livesP1 = actorsOnlyPlayers[i].health
      } /*else if (actorsOnlyPlayers[i].keyboardMap === MAP_P2) {
        this.livesP2 = actorsOnlyPlayers[i].health
      }*/
    };



    if (this.livesP1 < this.aHearthsP1.length) {
      for (let i = this.aHearthsP1.length; i > this.livesP1; i--) {
        this.aHearthsP1.pop()
      }
    } else if (this.livesP1 > this.aHearthsP1.length) {
      for (let i = this.aHearthsP1.length; i < this.livesP1; i++) {
        this.aHearthsP1.push(new GUIHearth({ x: 0, y: 0 }))
      }
      this.aHearthsP1.forEach((h, i) => {
        h.position = { x: 20 + (60 * i), y: 80 }
      })
        ;
    }

    //Enemies
    const actorsOnlyEnemies = actors.filter(act => (act instanceof EnemyTank)) as EnemyTank[]

    if (actorsOnlyEnemies.length < this.aEnemies.length) {
      for (let i = this.aEnemies.length; i > actorsOnlyEnemies.length; i--) {
        this.aEnemies.pop()
      }
    } else if (actorsOnlyEnemies.length > this.aEnemies.length) {
      for (let i = this.aEnemies.length; i < actorsOnlyEnemies.length; i++) {
        this.aEnemies.push(new GUIEnemy({ x: 0, y: 0 }))
      }
      this.aEnemies.forEach((h, i) => {
        h.position = { x: 1220 - (70 * i), y: 85 }
      })
        ;
    };

    //if (!actors.some(e => (e instanceof PlayerTank))) {
    // actors.push(new PlayerTank({ x: 550, y: 650 }, 3, -Math.PI / 2, MAP_P1));
    //};

  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void {


    ctx.fillStyle = 'white';
    ctx.direction = 'ltr';

    //FPSviewer
    const fps = (1 / delta).toFixed(0);
    ctx.font = '26px Verdana';
    ctx.fillText(`${fps} FPS`, 600, 30);

    //Labels
    ctx.fillStyle = 'white';
    ctx.font = '60px Verdana';

    //Level
    ctx.fillText(`LEVEL`, 560, 100);
    ctx.fillText(`${this.level} `, 630, 170);

    //Chrono
    ctx.fillText(`TIME: ${this.chrono.time.toFixed(0)}`, 10, 60);

    //Score
    ctx.direction = 'rtl';
    ctx.fillText(`SCORE: ${this.score}`, 1280, 60);
    ctx.direction = 'ltr';

    //Lives
    this.aHearthsP1.forEach((h) => {
      h.update(delta)
      h.draw(ctx, delta)
    })

    //Enemies
    this.aEnemies.forEach((h) => {
      h.update(delta)
      h.draw(ctx, delta)
    })


    //PAUSE
    if (this.pause === true) {
      ctx.fillStyle = 'white';
      ctx.direction = 'ltr';
      ctx.font = '200px Verdana';
      ctx.fillText(`PAUSE`, 300, 850);
    }

  };

  paintBackground(ctx: CanvasRenderingContext2D): void {

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.canvas.width, 200);

    for (let y = 200; y < ctx.canvas.height; y += 200) {
      for (let x = 0; x < ctx.canvas.width; x += 200) {
        ctx.drawImage(this.backgroundSprite, x, y, 200, 200)
      };
    };
  };


};



/*
export let GameInstance: GameManager;

export const createGameInstance = () => {
  GameInstance = new GameManager();
};*/
