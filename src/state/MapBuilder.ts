import { Console } from 'console';
import { Actor } from '../actors/Actor';
import { mapsBlueprints } from './Maps';
import { actors } from '../script'
import { DestructibleBlock, NotDestructibleBlock } from '../actors/MapBlockClasses';



export const MapBuilder = (level: number) => {

  if (level < 0) {
    //Level random
    //call RandomMapGemerator();
  } else {
    let map = mapsBlueprints[level].split('\n').map((row) => row.trim().split(''));

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
          default:
            console.log('Character not valid in map template:', char);
            break;
        };
        x_pos += w;
      });
      y_pos += h;
    });
  };
};