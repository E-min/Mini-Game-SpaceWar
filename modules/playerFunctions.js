import { GameObjectsComponent, Player } from './gameObjectsComponent.js';
import { mouseLocation } from './inputController.js';
import { touchLocation, isTouchDevice } from './inputController.js';

export const player = new Player(175, 500, 40, 40, 'player.png', 10);

const touchController = () => {
  let { touchX, touchY } = touchLocation;
  if (!touchX && !touchY) {
    touchX = player.x;
    touchY = player.y;
  } else {
    player.x = touchX;
    player.y = touchY - 80;
  }
};
const mouseController = () => {
  let { x, y } = mouseLocation;
  if (!x && !y) {
    x = player.x;
    y = player.y;
  } else {
    player.x = x;
    player.y = y;
  }
};

export const bullets = [];
let pastTime = Date.now();
let index = 0;
let maxBulletAmount;

const bulletGenerator = () => {
  const smallBulletSpawnX = player.x;
  const smallBulletSpawnY = player.y - 20;
  const currentTime = Date.now();
  const delta = currentTime - pastTime;
  if (touchLocation.onTouch || mouseLocation.leftClick) {
    maxBulletAmount = 7;
  } else {
    maxBulletAmount = 0;
  }
  if (delta >= 200) {
    if (bullets.length < maxBulletAmount) {
      bullets.push(
        new GameObjectsComponent(
          7,
          20,
          'small-red-bullet.png',
          smallBulletSpawnX,
          smallBulletSpawnY
        )
      );
    }
    if (index === bullets.length) {
      index = 0;
    }
    if (bullets.length === maxBulletAmount && maxBulletAmount) {
      bullets[index].hit = false;
      bullets[index].x = smallBulletSpawnX;
      bullets[index].y = smallBulletSpawnY;
      index++;
    }
    pastTime = currentTime;
  }
  requestAnimationFrame(bulletGenerator);
};
requestAnimationFrame(bulletGenerator);

const renderBullets = () => {
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    if (!bullet.hit) {
      bullet.movement(0, -10);
      bullet.update();
    }
  }
};

export const playerFunctions = () => {
  mouseController();
  isTouchDevice && touchController();
  !player.animationFinished && player.update();
  renderBullets();
};
