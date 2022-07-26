import { Point } from '../types/Point';
import { Size } from '../types/Size';

export interface IActor {
  position: Point;
  size: Size;
  IFF: string;
  health: number;
  newPos: Point;
  newPosGuess: Point;
  actorCollisions: boolean;
  bulletImpact: boolean;
  bulletImpactDamage: boolean;

  draw: (ctx: CanvasRenderingContext2D, delta: number) => void;
  update: (delta: number) => void;
  keyboard_event_down: (key: string) => void;
  keyboard_event_up: (key: string) => void;
}

export class Actor implements IActor {
  position: Point;
  size: Size;
  IFF: string;
  health: number;
  newPos: Point;
  newPosGuess: Point;
  actorCollisions: boolean;
  bulletImpact: boolean;
  bulletImpactDamage: boolean;
  constructor(position: Point, IFF: string, health: number, collisions: boolean, bulletImpact: boolean, bulletImpactDamage: boolean) {
    this.position = position;
    this.size = { width: 0, height: 0 };
    this.IFF = IFF;
    this.health = health;
    this.newPos = position;
    this.newPosGuess = position;
    this.actorCollisions = collisions;
    this.bulletImpact = bulletImpact;
    this.bulletImpactDamage = bulletImpactDamage;
  }

  update(delta: number) { }

  draw(ctx: CanvasRenderingContext2D, delta: number) { }

  keyboard_event_down(key: string) { }
  keyboard_event_up(key: string) { }
}
