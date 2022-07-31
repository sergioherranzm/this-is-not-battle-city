import { Point } from '../types/Point';
import { Size } from '../types/Size';
import { actors } from '../script';
import { Bullet } from '../actors/Bullet';
import { Actor } from '../actors/Actor';
import { EnemyTank } from '../actors/EnemyTank';
import { PlayerTank } from '../actors/PlayerTank';
import { DestructibleBlock, NotDestructibleBlock } from '../actors/MapBlockClasses';

let audioURL = new URL('../assets/sounds/hit_enemy.mp3', import.meta.url);
const audioHitEnemy = new Audio(audioURL.toString());

audioURL = new URL('../assets/sounds/hit_player.mp3', import.meta.url);
const audioHitPlayer = new Audio(audioURL.toString());

audioURL = new URL('../assets/sounds/hit_box.mp3', import.meta.url);
const audioHitBox = new Audio(audioURL.toString());

audioURL = new URL('../assets/sounds/destroy_box.mp3', import.meta.url);
const audioDestroyBox = new Audio(audioURL.toString());

audioURL = new URL('../assets/sounds/hit_rock.mp3', import.meta.url);
const audioHitRock = new Audio(audioURL.toString());

audioHitEnemy.volume = 1;
audioHitPlayer.volume = 1;
audioHitBox.volume = 0.4;
audioDestroyBox.volume = 0.15;
audioHitRock.volume = 1;

export const checkMapLimits = (position: Point, size: Size): boolean => {
  //funcion para detectar si el actor se sale del mapa / devuelve true si no se sale del mapa
  return (position.x + size.width / 2 < 1300 && position.x - size.width / 2 > 0 && position.y + size.height / 2 < 1500 && position.y - size.height / 2 > 200);
};

export const checkFreeSpawn = (mainActor: Actor): boolean => {
  //funcion para detectar si hay actores en el spawn / devuelve true si hay colision
  const actorsCollisions = actors.filter(act => (act instanceof EnemyTank));
  for (let i = 0; i <= actorsCollisions.length - 1; i++) {
    let otherActor = actorsCollisions[i];
    if (otherActor !== mainActor) {
      if (mainActor.size.width / 2 + otherActor.size.width / 2 >= Math.abs(mainActor.position.x - otherActor.newPos.x) && mainActor.size.height / 2 + otherActor.size.height / 2 >= Math.abs(mainActor.position.y - otherActor.newPos.y)) {
        return true;
      };
    };
  };
  return false;
};

export const checkMoveCollisions = (mainActor: Actor): boolean => {
  //funcion para detectar colisiones entre actores / devuelve true si hay colision
  const actorsCollisions = actors.filter(act => (act.actorCollisions === true));
  for (let i = 0; i <= actorsCollisions.length - 1; i++) {
    let otherActor = actorsCollisions[i];
    if (otherActor !== mainActor) {
      if (mainActor.size.width / 2 + otherActor.size.width / 2 >= Math.abs(mainActor.newPos.x - otherActor.newPos.x) && mainActor.size.height / 2 + otherActor.size.height / 2 >= Math.abs(mainActor.newPos.y - otherActor.newPos.y)) {
        //if (mainActor.size.width / 2 + otherActor.size.width / 2 >= Math.abs(mainActor.newPosGuess.x - otherActor.newPosGuess.x) && mainActor.size.height / 2 + otherActor.size.height / 2 >= Math.abs(mainActor.newPosGuess.y - otherActor.newPosGuess.y)) {
        return true;
      };
    };
  };
  return false;
};

export const checkBulletCollisions = (attackBullet: Bullet, shooter: EnemyTank | PlayerTank): void => {
  actors.forEach(defenderActor => {
    if (defenderActor !== attackBullet && defenderActor !== shooter && defenderActor.bulletImpact === true) {
      if (attackBullet.size.width / 2 + defenderActor.size.width / 2 >= Math.abs(attackBullet.position.x - defenderActor.position.x) && attackBullet.size.height / 2 + defenderActor.size.height / 2 >= Math.abs(attackBullet.position.y - defenderActor.position.y)) {

        //Updates
        if (attackBullet.IFF !== defenderActor.IFF && defenderActor.bulletImpactDamage === true) {
          if (defenderActor instanceof PlayerTank) {
            if (shooter instanceof EnemyTank && defenderActor.respawnTimer.active === false) {
              defenderActor.health -= attackBullet.health;
              defenderActor.loseLiveTimer.active = true;
            };
          } else if (defenderActor instanceof EnemyTank && shooter instanceof PlayerTank) {

            defenderActor.getNewRandomDirection();

            defenderActor.health -= attackBullet.health;

          } else {
            defenderActor.health -= attackBullet.health;
          };
        };
        attackBullet.health = 0;

        //Sounds
        if (defenderActor instanceof EnemyTank && shooter instanceof PlayerTank) {
          audioHitEnemy.load();
          audioHitEnemy.play();
        } else if (defenderActor instanceof PlayerTank && shooter instanceof EnemyTank) {

          if (defenderActor.respawnTimer.active === true) {
            audioHitRock.load();
            audioHitRock.play();
          };

        } else if (defenderActor instanceof DestructibleBlock && shooter instanceof PlayerTank) {
          if (defenderActor.health === 0) {
            audioDestroyBox.load();
            audioDestroyBox.play();
          } else {
            audioHitBox.load();
            audioHitBox.play();
          };

        } else if ((defenderActor instanceof NotDestructibleBlock || defenderActor instanceof Bullet) && shooter instanceof PlayerTank) {
          audioHitRock.load();
          audioHitRock.play();
        };

      };
    };
  });
};