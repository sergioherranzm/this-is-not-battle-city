import { ILevel } from "../types/Level";
import { allLevels } from './Levels';
import { actors } from '../script'
import { DestructibleBlock, NotDestructibleBlock, WaterBlock } from '../actors/MapBlockClasses';
import { EnemyTankHeavy, EnemyTankRapid, EnemyTankStandard, EnemyTankStrong } from "../actors/EnemyTankClasses";



export const MapBuilder = (level: number) => {

  let chosenLevel: ILevel | undefined;

  if (level < 0) {
    //Level random
    chosenLevel = allLevels.find(e => e.id === `LevelRandom`);
    //call RandomMapGemerator();
  } else {
    chosenLevel = allLevels.find(e => e.id === `Level${level}`);
  }

  //AÑADIR MAPA
  if (!chosenLevel) {
    chosenLevel = allLevels[0];
  }

  let map = chosenLevel.map.split('\n').map((row) => row.trim().split(''));

  const w = 100; //ctx.canvas.width / 13;
  const h = 100; //(ctx.canvas.height - 200) / 13;

  let x_pos = 0;
  let y_pos = 200;

  map.forEach((row, y) => {
    x_pos = 0;
    row.forEach((char, x) => {
      switch (char) {
        case '.': // whitespace

          break;
        case '%': //player spawnpoint

          break;
        case '*': //enemy spawnpoint

          break;
        case 'O': //destrutible block
          actors.push(new DestructibleBlock({ x: x_pos + w / 2, y: y_pos + h / 2 }))
          break;
        case 'X': //not destrutible block
          actors.push(new NotDestructibleBlock({ x: x_pos + w / 2, y: y_pos + h / 2 }))
          break;
        case 'S': //water block
          actors.push(new WaterBlock({ x: x_pos + w / 2, y: y_pos + h / 2 }))
          break;
        default:
          console.log('Character not valid in map template:', char);
          break;
      };
      x_pos += w;
    });
    y_pos += h;
  });

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
    }
  })

};