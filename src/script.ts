import { IActor } from './actors/Actor';
import { GameManager, IGameManager } from './state/GameManager';

let audioURL = new URL('./assets/sounds/pause.mp3', import.meta.url);
const audioPause = new Audio(audioURL.toString());

audioURL = new URL('./assets/sounds/play.mp3', import.meta.url);
const audioPlay = new Audio(audioURL.toString());

audioURL = new URL('./assets/sounds/start_level.mp3', import.meta.url);
const audioStartLevel = new Audio(audioURL.toString());

audioURL = new URL('./assets/sounds/music_menu.mp3', import.meta.url);
const audioMusic = new Audio(audioURL.toString());

audioURL = new URL('./assets/sounds/button_hover.mp3', import.meta.url);
const audioButtonHover = new Audio(audioURL.toString());

audioURL = new URL('./assets/sounds/button_level.mp3', import.meta.url);
const audioButtonLevel = new Audio(audioURL.toString());

audioURL = new URL('./assets/sounds/button_click.mp3', import.meta.url);
const audioButtonClick = new Audio(audioURL.toString());

audioPause.volume = 1;
audioPlay.volume = 1;
audioStartLevel.volume = 1;
audioMusic.volume = 0.1;
audioMusic.loop = true;
audioButtonHover.volume = 1;
audioButtonLevel.volume = 1;
audioButtonClick.volume = 1;

let button_levels: HTMLButtonElement;
let button_level1: HTMLButtonElement;
let button_level2: HTMLButtonElement;
let button_random: HTMLButtonElement;
let button_controls: HTMLButtonElement;
let button_back_controls: HTMLButtonElement;
let button_back_levels: HTMLButtonElement;
let menu: HTMLCanvasElement;
let levels: HTMLCanvasElement;
let controls: HTMLCanvasElement;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

window.onload = () => {

  audioMusic.play();
}
button_levels = document.getElementById('levels') as HTMLButtonElement;
button_level1 = document.getElementById('level1') as HTMLButtonElement;
button_level2 = document.getElementById('level2') as HTMLButtonElement;
button_random = document.getElementById('levelRandom') as HTMLButtonElement;
button_controls = document.getElementById('controls') as HTMLButtonElement;
button_back_controls = document.getElementById('back_controls') as HTMLButtonElement;
button_back_levels = document.getElementById('back_levels') as HTMLButtonElement;
menu = document.getElementById('menu-container') as HTMLCanvasElement;
levels = document.getElementById('level-container') as HTMLCanvasElement;
controls = document.getElementById('controls-container') as HTMLCanvasElement;
canvas = document.getElementById('canvas') as HTMLCanvasElement;
ctx = canvas.getContext('2d') as CanvasRenderingContext2D;


button_levels.addEventListener('click', (e) => {
  audioButtonClick.load();
  audioButtonClick.play();
  levels.classList.remove('hidden');
  menu.classList.add('hidden');
});

button_controls.addEventListener('click', (e) => {
  audioButtonClick.load();
  audioButtonClick.play();
  controls.classList.remove('hidden');
  menu.classList.add('hidden');
});

button_back_controls.addEventListener('click', (e) => {
  audioButtonClick.load();
  audioButtonClick.play();
  menu.classList.remove('hidden');
  controls.classList.add('hidden');
});

button_back_levels.addEventListener('click', (e) => {
  audioButtonClick.load();
  audioButtonClick.play();
  menu.classList.remove('hidden');
  levels.classList.add('hidden');
});

button_level1.addEventListener('click', (e) => {
  audioButtonLevel.load();
  audioButtonLevel.play();
  audioMusic.load();
  delay(200).then(() => {
    canvas.classList.remove('hidden');
    levels.classList.add('hidden');
    createNewGame('1');
  });
});

button_level2.addEventListener('click', (e) => {
  audioButtonLevel.load();
  audioButtonLevel.play();
  audioMusic.load();
  delay(200).then(() => {
    canvas.classList.remove('hidden');
    levels.classList.add('hidden');
    createNewGame('2');
  });
});

button_random.addEventListener('click', (e) => {
  audioButtonLevel.load();
  audioButtonLevel.play();
  audioMusic.load();
  delay(200).then(() => {
    canvas.classList.remove('hidden');
    levels.classList.add('hidden');
    createNewGame('-1');
  });
});

button_levels.addEventListener('mouseover', (e) => {
  audioButtonHover.load();
  audioButtonHover.play();
});

button_controls.addEventListener('mouseover', (e) => {
  audioButtonHover.load();
  audioButtonHover.play();
});

button_back_controls.addEventListener('mouseover', (e) => {
  audioButtonHover.load();
  audioButtonHover.play();
});

button_back_levels.addEventListener('mouseover', (e) => {
  audioButtonHover.load();
  audioButtonHover.play();
});

button_level1.addEventListener('mouseover', (e) => {
  audioButtonHover.load();
  audioButtonHover.play();
});

button_level2.addEventListener('mouseover', (e) => {
  audioButtonHover.load();
  audioButtonHover.play();
});

button_random.addEventListener('mouseover', (e) => {
  audioButtonHover.load();
  audioButtonHover.play();
});




export let actors: IActor[];
export let gameGUI: IGameManager;
let lastFrame = 0;

const delay = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
}

const createNewGame = (levelString: string) => {

  actors = [];
  gameGUI = new GameManager(levelString);
  gameGUI.paintBackground(ctx);
  gameGUI.draw(ctx, 0);

  audioStartLevel.load();
  audioStartLevel.play();


  delay(1300).then(() => {
    gameGUI.chrono = { time: 0, active: true };
    window.requestAnimationFrame(render);
  });
};

//Bucle de renderizado
const render = (time: number) => {
  let delta = (time - lastFrame) / 1000;
  lastFrame = time;

  gameGUI.update(delta);

  if (gameGUI.loseState === false && gameGUI.winState === false) {

    if (gameGUI.pause === false) {
      actors.forEach((actor) => {
        actor.update(delta);
      });
    };

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    gameGUI.paintBackground(ctx);

    actors.forEach((actor) => {
      ctx.save();
      actor.draw(ctx, delta);
      ctx.restore();
    });

  };

  gameGUI.draw(ctx, delta);

  if (!canvas.classList.contains('hidden')) {
    window.requestAnimationFrame(render);
  }

};

document.body.addEventListener('keydown', (e) => {
  if (e.key === 'p') {
    if (gameGUI.pause === false) {
      gameGUI.pause = true;
      gameGUI.chrono.active = false;
      audioPause.load();
      audioPause.play();
    } else {
      gameGUI.pause = false;
      gameGUI.chrono.active = true;
      audioPlay.load();
      audioPlay.play();
    }
  } else if (e.key === 'Escape') {
    if (!canvas.classList.contains('hidden')) {
      if (gameGUI.winState === false && gameGUI.loseState === false) {
        gameGUI.loseState = true;
      } else {
        menu.classList.remove('hidden');
        canvas.classList.add('hidden');
        gameGUI.audioLose.load();
        gameGUI.audioWin.load();
        audioMusic.play();
      };
    } else {
      menu.classList.remove('hidden');
      controls.classList.add('hidden');
      levels.classList.add('hidden');
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
