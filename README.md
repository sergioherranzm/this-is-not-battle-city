<p align="center">
  <a href="https://shields.io/">
    <img src="https://img.shields.io/badge/npm-8.12.1-green.svg" alt="npm version">
  </a>
  <a href="https://github.com/ellerbrock/typescript-badges">
    <img src="https://badges.frapsoft.com/typescript/code/typescript.svg?v=101" alt="typescript">
  </a>
  <a href="https://shields.io/">
    <img src="https://img.shields.io/badge/built%20with-vite-purple.svg" alt="vite">
  </a>
</p>

<!-- A spacer -->
<p>&nbsp;</p>

<p align="center">
    <img src="/public/title.png" alt="this-is-not-battle-city logo"/>
</p>

# This is not Battle City

### Puedes jugar *[aquí](https://sergioherranzm.github.io/this-is-not-battle-city/)*.&nbsp; &nbsp;[![Website perso.crans.org](https://img.shields.io/website-up-down-green-red/https/perso.crans.org.svg)](https://perso.crans.org/)

<!-- A spacer -->
<p>&nbsp;</p>

![test gif](/public/sample-gif.gif)

---

## Tabla de contenidos

- [Descripción del proyecto](#description)
- [Instalación](#install)
- [Estructura del proyecto](#structure)
- [Estructuras de código destacadas](#code)
- [Desarrollos futuros](#future)
- [Dependencias](#tech)
- [Licencia](#license)
- [Agradecimientos](#grats)
<!-- - [Menciones y bibliografía ](#grats)-->

## Descripción del proyecto <a name="description"></a>

Este proyecto ha sido concebido como proyecto de mitad de boootcamp **Desarrollo Web Cloud Native** de [Core Code School](https://www.corecode.school/).

El objetivo es la familiarización con la programación en leguaje Typescript, mediante la aplicación de los distintos conceptos vistos durante la primera mitad del bootcamp (interacción con el DOM, módulos, sprites, sonidos, clases, herencias... ) para la contrucción de un videojuego renderizado en un objeto HTMLCanvas.

***This is not Battle City*** nace por las ganas de un gamer nostálgico de revivir aquellos momentos de la infancia jugando en la Game Boy al mítico juego de Namco, Battle City.

En este juego te convertirás en el piloto de un tanque, y tu objetivo será derrotar a todos los enemigos que te rodean antes de que ellos acaben contigo.

Tu tanque puede moverse en las cuatro direciones (arriba, abajo, izquierda y derecha), pero estará limitado a sólo una de ellas a la vez. Además, por el mapa te encontrarás distintos obstáculos que deberas esquivar, o en algún caso incluso destruir.

Podrás manejar el tanque con las **flechas del teclado** y disparar con la tecla "**Ctrl**" (Control). También podrás pausar/despausar el juego con la tecla "**p**" y abandonar en cualquier momento con la tecla "**Esc**" (Escape).

La interfaz superior te mostrará en todo momento tus vidas y el número de enemigos restantes, además de: el nivel actual, el tiempo transcurrido, tu puntuación y los FPS actuales.

*¡Ponte el casco y a pelear!*


## Instalación <a name="install"></a>

Para la instalacion de este repositorio es necesario clonarlo en local, instalar dependencias y ejecutarlo en *localhost*.

Clonar el repositorio:
```js
git clone git@github.com:sergioherranzm/this-is-not-battle-city.git
```

Entrar en el repositorio e instalar dependencias:
```js
cd this-is-not-battle-city

npm install
```

Ejecutar el script:
```js
npm run dev
```

## Estructura del proyecto <a name="structure"></a>
```
.
├── index.html
├── index.d.ts
├── public
│   ├── style.css
│   ├── favicon.png
│   ├── *.png
│   └── *.jpg
└── src
    ├── types
    │   ├── Level.ts
    │   ├── Point.ts
    │   ├── Size.ts
    │   └── Timer.ts
    ├── state
    │   ├── GameManager.ts
    │   ├── GUIItem.ts
    │   ├── GUIEnemy.ts
    │   ├── GUIHearth.ts
    │   ├── MapBuilder.ts
    │   └── Levels.ts
    ├── actors
    │   ├── Actor.ts
    │   ├── Bullet.ts
    │   ├── PlayerTank.ts
    │   ├── EnemyTank.ts
    │   ├── EnemyTankClasses.ts
    │   ├── MapBlock.ts
    │   └── MapBlockClasses.ts
    ├── utils
    │   ├── checkCollisions.ts
    │   └── keyboardMap.ts
    └── assets
        ├── actors
        │   └── *.png
        ├── background
        │   └── *.png
        ├── sounds
        │   └── *.mp3
        ├── tiles
        │   └── *.png
        └── GUI.png

```

## Estructuras de código destacadas <a name="code"></a>

### Detección de inputs

Para la detección de input de movimiento del tanque del jugador, en principio se utilizo unos simples EventListeners de KeyDown/KeyUp que cambiaban directamente las propiedades del tanque. Sin embargo, este método presentaba varios problemas si se pulsaban varias teclas a la vez:
- Al mantener las teclas presionadas, el evento KeyDown se ejecutaba de forma repetida en una de ellas, pero en la otra sólo se registraba una vez.
- Cuando se soltaba una de las dos teclas, se ejecutaba un evento KeyUp, y se comportaba como si no quedase ninguna tecla pulsada.

```js
keyboard_event_down(key: string): void {
    const mappedKey = this.keyboardMap[key];
    if (mappedKey === CarKeys.LEFT) {
        this.tankAngle = Math.PI;
        this.tankMaxSpeed = this.tankDefaultMaxSpeed;
    } else if (mappedKey === CarKeys.RIGHT) {
        this.tankAngle = 0;
        this.tankMaxSpeed = this.tankDefaultMaxSpeed;
    } else if (mappedKey === CarKeys.UP) {
        this.tankAngle = -Math.PI / 2;
        this.tankMaxSpeed = this.tankDefaultMaxSpeed;
    } else if (mappedKey === CarKeys.DOWN) {
        this.tankAngle = Math.PI / 2;
        this.tankMaxSpeed = this.tankDefaultMaxSpeed;
    } else if (mappedKey === CarKeys.FIRE) {
        ...
    };
};

keyboard_event_up(key: string): void {
    const mappedKey = this.keyboardMap[key];
    if (mappedKey === CarKeys.UP || mappedKey === CarKeys.DOWN || mappedKey === CarKeys.LEFT || mappedKey === CarKeys.RIGHT) {
        this.tankMaxSpeed = 0;
    };
};
```

Como **solución** se implementó una funcion intermedia ***checkPressedKeys()*** que actúa de filtro entre los eventos de las teclas y los movimientos del tanque. Esto se consigue definiendo la propiedad ***this.pressedKeys*** que es un array que contiene las teclas que están actualmente presionadas (controlando que no haya items repetidos).

De este modo, lo que hacen los eventos KeyDown/KeyUp es meter y sacar items de este array, y no actúan directamente sobre el movimiento del tanque. Además, por el hecho de ser un array en vez de un objeto, *this.pressedKeys* nos permite saber el orden en el que el jugador ha pulsado las teclas, de modo que, al haber varias teclas pulsadas, el tanque siempre se moverá en la dirección de *this.pressedKeys[0]*.


```js
this.pressedKeys = [];
...
...
...
checkPressedKeys() {
    if (this.pressedKeys.length === 0) {
        this.tankMaxSpeed = 0;
    } else {
        this.tankMaxSpeed = this.tankDefaultMaxSpeed
        if (this.pressedKeys[0] === 'left') {
            this.tankAngle = Math.PI;
        } else if (this.pressedKeys[0] === 'right') {
            this.tankAngle = 0;
        } else if (this.pressedKeys[0] === 'up') {
            this.tankAngle = -Math.PI / 2;
        } else if (this.pressedKeys[0] === 'down') {
            this.tankAngle = Math.PI / 2;
        };
    };
};

keyboard_event_down(key: string): void {
    const mappedKey = this.keyboardMap[key];
    if (mappedKey === CarKeys.LEFT) {
        if (!this.pressedKeys.some(i => (i === 'left'))) {
            this.pressedKeys.push('left');
        };
    } else if (mappedKey === CarKeys.RIGHT) {
        if (!this.pressedKeys.some(i => (i === 'right'))) {
            this.pressedKeys.push('right');
        };
    } else if (mappedKey === CarKeys.UP) {
        if (!this.pressedKeys.some(i => (i === 'up'))) {
            this.pressedKeys.push('up');
        };
    } else if (mappedKey === CarKeys.DOWN) {
        if (!this.pressedKeys.some(i => (i === 'down'))) {
            this.pressedKeys.push('down');
        };
    } else if (mappedKey === CarKeys.FIRE) {
        ...
    };
};

keyboard_event_up(key: string): void {
    const mappedKey = this.keyboardMap[key];
    if (mappedKey === CarKeys.LEFT) {
        this.pressedKeys.splice(this.pressedKeys.indexOf('left'), 1);
    } else if (mappedKey === CarKeys.RIGHT) {
        this.pressedKeys.splice(this.pressedKeys.indexOf('right'), 1);
    } else if (mappedKey === CarKeys.UP) {
        this.pressedKeys.splice(this.pressedKeys.indexOf('up'), 1);
    } else if (mappedKey === CarKeys.DOWN) {
        this.pressedKeys.splice(this.pressedKeys.indexOf('down'), 1);
    };
};
```

### Generación procedural de mapas

Unas de las funcionalidades adicionales que se  ha añadido, es la herramienta para generar mapas de forma procedural, dando lugar a niveles aleatorios, a parte de los 5 mapas prediseñados ya incluidos.

Para explicar esta funcionalidad es necesario primero mostrar la estructura de un nivel:

```js
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
```

Como se puede observar, para general un nivel aleatorio se necesitaría:

- Un fondo aleatorio entre los 3 existentes (*backgroundDirt, backgroundGrass, backgroundRocks*):
```js
const getRandomBackground = (): string => {
  const backgroundTiles = [backgroundDirt, backgroundGrass, backgroundRocks];
  return backgroundTiles[lodash.random(0, 2)];
};
```

- Un mapa consistente en un string de 13 filas, cada una con 13 caracteres, que representan un tipo de bloque distinto de acuerdo a la siguiente lista:

>   . = whithespace  
>   % = player spawnpoint  
>   O = destrutible block  
>   X = not destrutible block  
>   S = water block

```js
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
```

- Un número de enemigos aleatorio, cada uno aleatoriamente elegido de entre los 4 tipos que hay (*Standard, Rapid, Strong, Heavy*)
```js
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
```

## Desarrollos futuros <a name="future"></a>

Debido al corto perdiodo de desarrollo disponible, ha habido ciertas funcionalidades que no han sido implementadas en la versión final:

- Multijugador local
- Modo supervivencia
- Aparición aleatoria de enemigos
- Suavizado de movimientos de tanques
- Adaptación a pantallas táctiles

## Dependencias <a name="tech"></a>

- [Lodash](https://lodash.com/)

## Licencia <a name="license"></a>

- See license *[here](/LICENSE)*.

## Agradecimientos <a name="grats"></a>

Agradecimientos al profesor del bootcamp Luis Miguel Feijoo por toda la ayuda prestada y los conocimientos transmitidos.

También a mis compañeros del bootcamp por todo el apoyo y el buen rollo; y a Core Code School por las facilidades que dan y la calidad de su enseñanza.

<!-- ## Menciones y bibliografía <a name="mentions"></a> -->