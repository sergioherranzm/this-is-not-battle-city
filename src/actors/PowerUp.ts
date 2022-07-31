import { Actor } from './Actor';
import { Point } from '../types/Point';
import { actors } from '../script';
import { PlayerTank } from '../actors/PlayerTank';
const audioURLGet = new URL('../assets/sounds/powerup_get.mp3', import.meta.url);


export class PowerUp extends Actor {
  actorSprite: HTMLImageElement;
  audioGetPowerUp: HTMLAudioElement;
  typePowerUp: string;

  constructor(position: Point, sprite: string, type: string) {
    super(position, 'None', 1, false, false, false);
    this.size = { width: 100, height: 100 };
    this.actorSprite = new Image();
    this.actorSprite.src = sprite;
    this.audioGetPowerUp = new Audio(audioURLGet.toString());
    this.audioGetPowerUp.volume = 0.3;
    this.typePowerUp = type;
  };

  update(delta: number): void {

    if (this.health <= 0) {
      const actorToRemove = actors.indexOf(this);
      actors.splice(actorToRemove, 1);
    } else {
      const actorsPlayers = actors.filter((act): act is PlayerTank => (act instanceof PlayerTank));
      for (let i = 0; i <= actorsPlayers.length - 1; i++) {
        let otherActor = actorsPlayers[i];
        if (this.size.width / 2 + otherActor.size.width / 2 >= Math.abs(this.position.x - otherActor.newPos.x) && this.size.height / 2 + otherActor.size.height / 2 >= Math.abs(this.position.y - otherActor.newPos.y)) {
          this.health = 0;
          this.audioGetPowerUp.load();
          this.audioGetPowerUp.play();
          //gameGUI.exitsPowerUp = {active: false, time: 0};
          switch (this.typePowerUp) {
            case '+life':
              otherActor.health += 1;
              break;
            case '+speed':
              otherActor.tankDefaultMaxSpeed = 400;
              otherActor.effectPowerup = this.typePowerUp;
              otherActor.timerPowerup = { active: true, time: 10 };
              break;
            case '+damage':
              otherActor.tankBulletDamage = 2;
              otherActor.effectPowerup = this.typePowerUp;
              otherActor.timerPowerup = { active: true, time: 10 };
              break;
          };
        };
      };
    };
  };

  draw(ctx: CanvasRenderingContext2D, delta: number): void {

    ctx.translate(this.position.x, this.position.y);
    ctx.drawImage(this.actorSprite, - this.size.width / 2, - this.size.height / 2, this.size.width, this.size.height);

  };

};