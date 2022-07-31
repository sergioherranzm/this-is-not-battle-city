import { ILevel } from "../types/Level";
import backgroundRocks from '../assets/background/Ground_Tile_01_A.png';
import backgroundGrass from '../assets/background/Ground_Tile_02_B.png';
import backgroundDirt from '../assets/background/Ground_Tile_02_C.png';

/*
    . = whithespace
    % = player spawnpoint
    * = enemy spawnpoint
    O = destrutible block
    X = not destrutible block
    S = water block

*/

const Level0: ILevel = {
    id: 'Level0',

    background: backgroundGrass,

    map: `.............
    .............
    .............
    .............
    .............
    .............
    ......%......
    .............
    .............
    .............
    .............
    .............
    .............`,

    enemies: [
        { type: 'EnemyTankStandar', position: { x: 100, y: 300 }, angle: Math.PI / 2 }
    ]

};

const Level1: ILevel = {
    id: 'Level1',

    background: backgroundDirt,

    map: `.............
    .O.O.O.O.O.O.
    .O.O.OXO.O.O.
    .O.O.O.O.O.O.
    .O.O.....O.O.
    .....O.O.....
    X.OO.....OO.X
    .....O.O.....
    .O.O.OOO.O.O.
    .O.O.O.O.O.O.
    .O.O.....O.O.
    .O.O.OOO.O.O.
    .....O%O.....`,

    enemies: [
        { type: 'EnemyTankStandard', position: { x: 50, y: 950 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStandard', position: { x: 50, y: 250 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStandard', position: { x: 1150, y: 250 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStandard', position: { x: 1150, y: 950 }, angle: Math.PI / 2 }
    ]
};

const Level2: ILevel = {
    id: 'Level2',

    background: backgroundGrass,

    map: `.....XXX.....
    .............
    ..SSOSSSOSS..
    ..S..O.O..S..
    ..O.SS.SS.O..
    X.SOS...SOS.X
    X.S...%...S.X
    X.SOS...SOS.X
    ..O.SS.SS.O..
    ..S..O.O..S..
    ..SSOSSSOSS..
    .............
    .....XXX.....`,

    enemies: [
        { type: 'EnemyTankStandard', position: { x: 50, y: 250 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStandard', position: { x: 950, y: 250 }, angle: Math.PI / 2 },
        { type: 'EnemyTankRapid', position: { x: 150, y: 1100 }, angle: Math.PI / 2 },
        { type: 'EnemyTankRapid', position: { x: 950, y: 1100 }, angle: Math.PI / 2 },
        { type: 'EnemyTankRapid', position: { x: 1200, y: 250 }, angle: Math.PI / 2 }
    ]
};

const Level3: ILevel = {
    id: 'Level3',

    background: backgroundDirt,

    map: `.............
    .....XXX.....
    .....OXO.....
    ...X.....X...
    ....X...X....
    ..S...O...S..
    X.SS.OXO.SS.X
    ......O......
    ....X...X....
    ...X.....X...
    ...SS...SS...
    .....OOO.....
    ..X..O%O..X..`,

    enemies: [
        { type: 'EnemyTankStandard', position: { x: 50, y: 250 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStandard', position: { x: 950, y: 250 }, angle: Math.PI / 2 },
        { type: 'EnemyTankRapid', position: { x: 200, y: 1200 }, angle: Math.PI / 2 },
        { type: 'EnemyTankRapid', position: { x: 1200, y: 950 }, angle: Math.PI / 2 },
        { type: 'EnemyTankRapid', position: { x: 1200, y: 1200 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStrong', position: { x: 800, y: 550 }, angle: Math.PI / 2 },
        { type: 'EnemyTankHeavy', position: { x: 600, y: 550 }, angle: Math.PI / 2 }
    ]
};

const Level4: ILevel = {
    id: 'Level4',

    background: backgroundRocks,

    map: `..O..O...O...
    .OOO.O.X.O...
    .....O.O.O.O.
    .SSSSSSSSSS.S
    .O.....O.....
    ..O...OOOOOXX
    OO.O..OO.O...
    ...X.X...OXXO
    SS.SSSSS.SSSS
    ....O.OO...O.
    ..O.O..O.XOO.
    .XO.O......O.
    ......%..O...`,

    enemies: [
        { type: 'EnemyTankStandard', position: { x: 1250, y: 1200 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStandard', position: { x: 1150, y: 250 }, angle: Math.PI / 2 },
        { type: 'EnemyTankRapid', position: { x: 150, y: 1200 }, angle: Math.PI / 2 },
        { type: 'EnemyTankRapid', position: { x: 400, y: 250 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStrong', position: { x: 500, y: 750 }, angle: Math.PI / 2 },
        { type: 'EnemyTankHeavy', position: { x: 1000, y: 650 }, angle: Math.PI / 2 }
    ]
};

const Level5: ILevel = {
    id: 'Level5',

    background: backgroundGrass,

    map: `X.....X.....X
    .............
    ...X.....X...
    ..X..OOO..X..
    ....SSSSS....
    ...OS...SO...
    X..OS.%.SO..X
    ...OS...SO...
    ....SSSSS....
    ..X..OOO..X..
    ...X.....X...
    .............
    X.....X.....X`,

    enemies: [
        { type: 'EnemyTankRapid', position: { x: 250, y: 1400 }, angle: Math.PI / 2 },
        { type: 'EnemyTankRapid', position: { x: 250, y: 250 }, angle: Math.PI / 2 },
        { type: 'EnemyTankRapid', position: { x: 1050, y: 750 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStrong', position: { x: 950, y: 250 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStrong', position: { x: 950, y: 1400 }, angle: Math.PI / 2 },
        { type: 'EnemyTankStrong', position: { x: 250, y: 650 }, angle: Math.PI / 2 }
    ]
};


const LevelRandom: ILevel = {
    id: 'LevelRandom',

    background: '',

    map: ``,

    enemies: []
};

export const allLevels: ILevel[] = [Level1, Level2, Level3, Level4, Level5, LevelRandom];