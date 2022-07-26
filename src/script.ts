import { IActor } from './actors/Actor';
import { PlayerTank } from './actors/PlayerTank';
import { Bullet } from './actors/Bullet';
//import { FPSViewer } from './state/FPSViewer';
import { GameManager } from './state/GameManager';
import { MAP_P1, MAP_P2 } from './utils/keyboardMap';
import { EnemyTankStandard, EnemyTankRapid, EnemyTankHeavy, EnemyTankStrong } from './actors/EnemyTankClasses';

export let actors: IActor[] = []

window.onload = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  //createCircuit(car);
  actors = [
    new PlayerTank({ x: 650, y: 850 }, 3, -Math.PI / 2, MAP_P1),
    new EnemyTankStandard({ x: 200, y: 250 }, Math.PI / 2),
    new EnemyTankRapid({ x: 300, y: 300 }, -Math.PI / 2),
    new EnemyTankStrong({ x: 800, y: 300 }, -Math.PI / 2),
    new EnemyTankHeavy({ x: 900, y: 300 }, -Math.PI / 2),
  ];

  let gameGUI = new GameManager();

  let lastFrame = 0;
  //Bucle de renderizado
  const render = (time: number) => {
    let delta = (time - lastFrame) / 1000;
    lastFrame = time;

    gameGUI.update(delta)

    actors.forEach((actor) => {
      actor.update(delta);
    });

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    gameGUI.draw(ctx, delta)

    actors.forEach((actor) => {
      ctx.save();
      actor.draw(ctx, delta);
      ctx.restore();
    });

    /*//NO FUNCIONA------------------------------------------------------------
    if (actors.filter(e => (e instanceof PlayerTank)).length = 0) {
      console.log('insertnado new player')
      actors.push(new PlayerTank({ x: 550, y: 650 }, 1, -Math.PI / 2, MAP_P1))
    }//----------------------------------------------------------------------*/

    window.requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);

  document.body.addEventListener('keydown', (e) => {
    actors.forEach((actor) => {
      actor.keyboard_event_down(e.key);
    });
  });

  document.body.addEventListener('keyup', (e) => {
    actors.forEach((actor) => {
      actor.keyboard_event_up(e.key);
    });
  });
};
