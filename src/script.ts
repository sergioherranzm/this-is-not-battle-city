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




//window.onload = () => {
const button_level1 = document.getElementById('level1') as HTMLButtonElement;
const button_level2 = document.getElementById('level2') as HTMLButtonElement;
const button_random = document.getElementById('levelRandom') as HTMLButtonElement;
const button_controls = document.getElementById('controls') as HTMLButtonElement;
const button_back = document.getElementById('back') as HTMLButtonElement;
const menu = document.getElementById('menu-container') as HTMLCanvasElement;
const controls = document.getElementById('controls-container') as HTMLCanvasElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
//}

export let actors: IActor[];
export let gameGUI: IGameManager;
let lastFrame = 0;


const createNewGame = (leverNumber: string) => {
  actors = [];
  gameGUI = new GameManager(leverNumber);
  window.requestAnimationFrame(render);
}



/*
//createCircuit(car);
actors = [
  new PlayerTank({ x: 650, y: 850 }, 3, -Math.PI / 2, MAP_P1),
  new EnemyTankStandard({ x: 200, y: 250 }, Math.PI / 2),
  //new EnemyTankRapid({ x: 300, y: 300 }, -Math.PI / 2),
  //new EnemyTankStrong({ x: 800, y: 300 }, -Math.PI / 2),
  //new EnemyTankHeavy({ x: 900, y: 300 }, -Math.PI / 2),
];
*/

//Bucle de renderizado
const render = (time: number) => {
  let delta = (time - lastFrame) / 1000;
  lastFrame = time;

  console.log('actors', actors)

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

  if (!canvas.classList.contains('hidden')) {
    window.requestAnimationFrame(render);
  }

};



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
    } else {
      menu.classList.remove('hidden')
      canvas.classList.add('hidden')
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

button_controls.addEventListener('click', (e) => {
  controls.classList.remove('hidden')
  menu.classList.add('hidden')
});

button_back.addEventListener('click', (e) => {
  menu.classList.remove('hidden')
  controls.classList.add('hidden')
});

button_level1.addEventListener('click', (e) => {
  canvas.classList.remove('hidden')
  menu.classList.add('hidden')
  createNewGame('1');
});

button_level2.addEventListener('click', (e) => {
  canvas.classList.remove('hidden')
  menu.classList.add('hidden')
  createNewGame('2');
});

button_random.addEventListener('click', (e) => {
  canvas.classList.remove('hidden')
  menu.classList.add('hidden')
  createNewGame('-1');
});
