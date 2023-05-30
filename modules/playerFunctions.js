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
const powerUp = new GameObjectsComponent(30, 30, 'double-health-0.png', 175, -50);
powerUp.gained = true
let selectedPowerUp;

const doubleHealth = () => {
  let lastTime = Date.now();
  let frame = 0;
  const update = () => {
    const currentTime = Date.now();
    const delta = currentTime - lastTime;
    if (delta >= 50) {
      powerUp.textureName = `double-health-${frame}.png`
      frame++
      if(frame >= 10) {
        frame = 0;
      }
      lastTime = currentTime;
    }
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

const createRandomPowerUp = () => {
  powerUp.gained = true;
  const randomNumber = 1; //Math.floor(Math.random() * 4)
  selectedPowerUp = randomNumber;
  switch (randomNumber) {
    case 1:
      doubleHealth();
      break;
  }
};

setInterval(() => {
  createRandomPowerUp();
  const randomXaxis = Math.floor(Math.random() * 280) + 50;
  powerUp.x = randomXaxis;
  powerUp.y = -50;
  powerUp.gained = false;
}, 20000);
// let lastTime = Date.now();
// const update = () => {
//   const currentTime = Date.now();
//   const delta = currentTime - lastTime;
//   if (delta >= 100) {
//     lastTime = currentTime;
//   }
//   requestAnimationFrame(update);
// };
// requestAnimationFrame(update);

const renderPowerUps = () => {
  if (
    powerUp.y + powerUp.height / 2 > player.y - player.height / 2 &&
    powerUp.y - powerUp.height / 2 < player.y + player.height / 2 &&
    powerUp.x + powerUp.width / 2 > player.x - player.height / 2 &&
    powerUp.x - powerUp.width / 2 < player.x + player.height / 2 &&
    !powerUp.gained
  ) {
    switch (selectedPowerUp) {
      case 1:
        player.doubleHealth = true;
        player.health = player.maxHealth * 2
        powerUp.gained = true;
        break;
    }
  }
  if (!powerUp.gained) {
    powerUp.movement(0, 3);
    powerUp.update();
  }
};

export const playerFunctions = () => {
  mouseController();
  isTouchDevice && touchController();
  renderPowerUps();
  !player.animationFinished && player.update();
};
