import { Point } from '../types/Point';
import { Size } from '../types/Size';
import { actors } from '../script';
import { Bullet } from '../actors/Bullet';
import { Actor } from '../actors/Actor';

export const checkMapLimits = (position: Point, size: Size): boolean => {
  return (
    position.x + size.width / 2 < 1000 && position.x - size.width / 2 > 0 && position.y + size.height / 2 < 1200 && position.y - size.height / 2 > 200
  );
};

export const checkMoveCollisions = (mainActor: Actor): boolean => {
  //funcion para detertar colisiones entre actores
  const actorsNoBullets = actors.filter(act => !(act instanceof Bullet))
  for (let i = 0; i <= actorsNoBullets.length - 1; i++) {
    let otherActor = actorsNoBullets[i]
    if (otherActor !== mainActor) {
      if (mainActor.size.width / 2 + otherActor.size.width / 2 >= Math.abs(mainActor.newPos.x - otherActor.newPos.x) && mainActor.size.height / 2 + otherActor.size.height / 2 >= Math.abs(mainActor.newPos.y - otherActor.newPos.y)) {
        //if (mainActor.size.width / 2 + otherActor.size.width / 2 >= Math.abs(mainActor.newPosGuess.x - otherActor.newPosGuess.x) && mainActor.size.height / 2 + otherActor.size.height / 2 >= Math.abs(mainActor.newPosGuess.y - otherActor.newPosGuess.y)) {
        return true
      }
    }

  };
  return false
};

export const checkBulletCollisions = (attackBullet: Bullet): void => {
  actors.forEach(defenderActor => {
    if (defenderActor !== attackBullet) {
      if (attackBullet.size.width / 2 + defenderActor.size.width / 2 >= Math.abs(attackBullet.position.x - defenderActor.position.x) && attackBullet.size.height / 2 + defenderActor.size.height / 2 >= Math.abs(attackBullet.position.y - defenderActor.position.y)) {
        //console.log('collision with', defenderActor.IFF)
        if (attackBullet.IFF !== defenderActor.IFF) {
          defenderActor.health -= attackBullet.health
          attackBullet.health = 0
        }
      }
    }
  });
};