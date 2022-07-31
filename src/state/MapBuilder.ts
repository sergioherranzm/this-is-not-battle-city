import { ILevel, IEnemy } from "../types/Level";
import { allLevels } from './Levels';
import { actors } from '../script';
import { DestructibleBlock, NotDestructibleBlock, WaterBlock, SpawnPlayerP1 } from '../actors/MapBlockClasses';
import { EnemyTankHeavy, EnemyTankRapid, EnemyTankStandard, EnemyTankStrong } from "../actors/EnemyTankClasses";
import lodash from 'lodash';
import backgroundRocks from '../assets/background/Ground_Tile_01_A.png';
import backgroundGrass from '../assets/background/Ground_Tile_02_B.png';
import backgroundDirt from '../assets/background/Ground_Tile_02_C.png';

export let chosenLevel: ILevel;

export const MapBuilder = (level: number) => {

  if (level < 0) { //Level random

    chosenLevel = allLevels.find(e => e.id === `LevelRandom`) as ILevel;
    chosenLevel.map = getRandomMap();
    chosenLevel.background = getRandomBackground();
    pushRandomEnemies();

  } else {
    chosenLevel = allLevels.find(e => e.id === `Level${level}`) as ILevel;

    //AÑADIR ENEMIGOS
    chosenLevel.enemies.forEach(e => {

      switch (e.type) {
        case 'EnemyTankStandard':
          actors.push(new EnemyTankStandard(e.position, e.angle));
          break;

        case 'EnemyTankRapid':
          actors.push(new EnemyTankRapid(e.position, e.angle));
          break;

        case 'EnemyTankStrong':
          actors.push(new EnemyTankStrong(e.position, e.angle));
          break;

        case 'EnemyTankHeavy':
          actors.push(new EnemyTankHeavy(e.position, e.angle));
          break;
      };
    });
  };

  //AÑADIR MAPA
  let map = chosenLevel.map.split('\n').map((row) => row.trim().split(''));

  const w = 100; //ctx.canvas.width / 13;
  const h = 100; //(ctx.canvas.height - 200) / 13;

  let x_pos = 0;
  let y_pos = 200;

  map.forEach((row) => {
    x_pos = 0;
    row.forEach((char) => {
      switch (char) {
        case '.': // whitespace

          break;
        case '%': //player 1 spawnpoint
          actors.push(new SpawnPlayerP1({ x: x_pos + w / 2, y: y_pos + h / 2 }));
          break;
        /*case '*': //enemy spawnpoint

        break;*/
        case 'O': //destrutible block
          actors.push(new DestructibleBlock({ x: x_pos + w / 2, y: y_pos + h / 2 }));
          break;
        case 'X': //not destrutible block
          actors.push(new NotDestructibleBlock({ x: x_pos + w / 2, y: y_pos + h / 2 }));
          break;
        case 'S': //water block
          actors.push(new WaterBlock({ x: x_pos + w / 2, y: y_pos + h / 2 }));
          break;
        default:
          console.log('Character not valid in map template:', char);
          break;
      };
      x_pos += w;
    });
    y_pos += h;
  });
};

const getRandomMap = (): string => {
  let newMap: string[][] = [[], [], [], [], [], [], [], [], [], [], [], [], []];
  let probability_y: number;
  let probability_x: number;
  for (let y = 0; y <= 12; y++) {
    for (let x = 0; x <= 12; x++) {
      probability_y = lodash.random(1, 100);
      if (probability_y < 60) { //probabilidad 60% de Whitespace
        newMap[y].push('.');
      } else if (probability_y >= 60 && probability_y < 85) { //probabilidad 15% de Destrutible Block
        newMap[y].push('O');
      } else if (probability_y >= 85 && probability_y < 95) { //probabilidad 10% de Not Destrutible Block
        newMap[y].push('X');
      } else if (probability_y >= 95 && probability_y <= 100) { //probabilidad 5% de Water Block
        newMap[y].push('S');
      }
    };
  };

  //Añadir punto de spawn del jugador en whitespace aleatorio
  while (true) {
    probability_y = lodash.random(0, 12);
    probability_x = lodash.random(0, 12);
    if (newMap[probability_y][probability_x] === '.') {
      newMap[probability_y][probability_x] = '%';
      break;
    };
  };

  return newMap.map(y => y.join('')).join('\n');
};

const getRandomBackground = (): string => {
  const backgroundTiles = [backgroundDirt, backgroundGrass, backgroundRocks];
  return backgroundTiles[lodash.random(0, 2)];
};

const pushRandomEnemies = (): void => {
  let numberOfEnemies: number = lodash.random(3, 6);
  const EnemyTypes = ['EnemyTankStandard', 'EnemyTankRapid', 'EnemyTankStrong', 'EnemyTankHeavy'];

  for (let e = 1; e <= numberOfEnemies; e++) {
    let probability_y: number;
    let probability_x: number;

    while (true) {
      probability_y = lodash.random(0, 12);
      probability_x = lodash.random(0, 12);
      let actualMap = chosenLevel.map.split('\n').map(y => y.split(''));
      if (actualMap[probability_y][probability_x] === '.') {
        switch (EnemyTypes[lodash.random(0, 3)]) {
          case 'EnemyTankStandard':
            actors.push(new EnemyTankStandard({ x: (probability_x * 100) + 50, y: (probability_y * 100) + 250 }, Math.PI / 2));
            break;
          case 'EnemyTankRapid':
            actors.push(new EnemyTankRapid({ x: (probability_x * 100) + 50, y: (probability_y * 100) + 250 }, Math.PI / 2));
            break;
          case 'EnemyTankStrong':
            actors.push(new EnemyTankStrong({ x: (probability_x * 100) + 50, y: (probability_y * 100) + 250 }, Math.PI / 2));
            break;
          case 'EnemyTankHeavy':
            actors.push(new EnemyTankHeavy({ x: (probability_x * 100) + 50, y: (probability_y * 100) + 250 }, Math.PI / 2));
            break;
        };
        break;
      };
    };
  };
};