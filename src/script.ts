import { IActor } from './actors/Actor';
import { PlayerTank } from './actors/PlayerTank';
import { GameManager, IGameManager } from './state/GameManager';
import { MAP_P1, MAP_P2 } from './utils/keyboardMap';
import { EnemyTankStandard, EnemyTankRapid, EnemyTankHeavy, EnemyTankStrong } from './actors/EnemyTankClasses';

let audioURL = new URL('./assets/sounds/pause.mp3', import.meta.url)
const audioPause = new Audio(audioURL.toString());

audioURL = new URL('./assets/sounds/play.mp3', import.meta.url)
const audioPlay = new Audio(audioURL.toString());

audioPause.volume = 1;
audioPlay.volume = 1;

export let actors: IActor[] = [];

export let gameGUI: IGameManager;

window.onload = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  //createCircuit(car);
  actors = [
    new PlayerTank({ x: 650, y: 850 }, 3, -Math.PI / 2, MAP_P1),
    new EnemyTankStandard({ x: 200, y: 250 }, Math.PI / 2),
    //new EnemyTankRapid({ x: 300, y: 300 }, -Math.PI / 2),
    //new EnemyTankStrong({ x: 800, y: 300 }, -Math.PI / 2),
    //new EnemyTankHeavy({ x: 900, y: 300 }, -Math.PI / 2),
  ];

  gameGUI = new GameManager();

  let lastFrame = 0;
  //Bucle de renderizado
  const render = (time: number) => {
    let delta = (time - lastFrame) / 1000;
    lastFrame = time;

    gameGUI.update(delta)

    if (gameGUI.loseState === false && gameGUI.winState === false) {

      if (gameGUI.pause === false) {
        actors.forEach((actor) => {
          actor.update(delta);
        });
      };

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      gameGUI.paintBackground(ctx)

      actors.forEach((actor) => {
        ctx.save();
        actor.draw(ctx, delta);
        ctx.restore();
      });

    };

    gameGUI.draw(ctx, delta)




    /*//NO FUNCIONA------------------------------------------------------------
    if (actors.filter(e => (e instanceof PlayerTank)).length = 0) {
      console.log('insertnado new player')
      actors.push(new PlayerTank({ x: 550, y: 650 }, 1, -Math.PI / 2, MAP_P1))
    }//----------------------------------------------------------------------*/

    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);

  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'p') {
      if (gameGUI.pause === false) {
        gameGUI.pause = true;
        gameGUI.chrono.active = false;
        audioPause.load()
        audioPause.play()
      } else {
        gameGUI.pause = false;
        gameGUI.chrono.active = true;
        audioPlay.load()
        audioPlay.play()
      }
    } else if (e.key === 'Escape') {
      if (gameGUI.winState === false && gameGUI.loseState === false) {
        gameGUI.loseState = true;
      };
    } else {
      if (gameGUI.pause === false) {
        actors.forEach((actor) => {
          actor.keyboard_event_down(e.key);
        });
      };
    };
  });

  document.body.addEventListener('keyup', (e) => {
    if (gameGUI.pause === false) {
      actors.forEach((actor) => {
        actor.keyboard_event_up(e.key);
      });
    };
  });
};


