export enum CarKeys {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  FIRE
};

export interface KeyboardMap {
  [key: string]: CarKeys;
};

export const MAP_P1 = {
  ArrowUp: CarKeys.UP,
  ArrowDown: CarKeys.DOWN,
  ArrowLeft: CarKeys.LEFT,
  ArrowRight: CarKeys.RIGHT,
  Control: CarKeys.FIRE
};

export const MAP_P2 = {
  w: CarKeys.UP,
  s: CarKeys.DOWN,
  a: CarKeys.LEFT,
  d: CarKeys.RIGHT,
  v: CarKeys.FIRE
};