import { GameObjectsComponent, Player } from './gameObjectsComponent.js';
import { soundEffects } from './gameSoundEffects.js';
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
const powerUp = new GameObjectsComponent(
  30,
  30,
  'double-health-frames/double-health-0.png',
  175,
  -50
);
powerUp.gained = true;
let randomNumber;

const createRandomPowerUp = () => {
  randomNumber = Math.floor(Math.random() * 3) + 1;
  if (randomNumber === 3) {
    powerUp.width = 50;
    powerUp.height = 50;
  } else {
    powerUp.width = 40;
    powerUp.height = 40;
  }
 powerUpFrames();
};
const powerUpFrames = () => {
  let frame = 0;
  let maxFrame = 0;
  let lastTime = Date.now();
  const update = () => {
    if(powerUp.gained) {
      return;
    }
    const currentTime = Date.now();
    const delta = currentTime - lastTime;
    if (delta >= 100) {
      switch (randomNumber) {
        case 1:
          powerUp.textureName = `double-health-frames/double-health-${frame}.png`;
          maxFrame = 10;
          break;
        case 2:
          powerUp.textureName = `double-barrel-frames/double-barrel-${frame}.png`;
          maxFrame = 13;
          break;
        case 3:
          powerUp.textureName = `triple-barrel-frames/triple-barrel-${frame}.png`;
          maxFrame = 13;
          break;
      }
      frame++;
      if (frame >= maxFrame) {
        frame = 0;
      }
      lastTime = currentTime;
    }
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

setInterval(() => {
  createRandomPowerUp();
  const randomXaxis = Math.floor(Math.random() * 280) + 50;
  powerUp.x = randomXaxis;
  powerUp.y = -50;
  powerUp.gained = false;
}, 12000);

const renderPowerUps = () => {
  if (powerUp.y > canvas.height + 50) {
    powerUp.gained = true;
  }
  if (
    powerUp.y + powerUp.height / 2 > player.y - player.height / 2 &&
    powerUp.y - powerUp.height / 2 < player.y + player.height / 2 &&
    powerUp.x + powerUp.width / 2 > player.x - player.height / 2 &&
    powerUp.x - powerUp.width / 2 < player.x + player.height / 2 &&
    !powerUp.gained
  ) {
    switch (randomNumber) {
      case 1:
        player.doubleHealth = true;
        player.health = player.maxHealth * 2;
        break;
      case 2:
        player.doubleBarrel = true;
        player.multipleBarrels();
        setTimeout(() => {
          player.doubleBarrel = false;
          player.multipleBarrels();
        }, 10000);
        break;
      case 3:
        player.tripleBarrel = true;
        player.multipleBarrels();
        setTimeout(() => {
          player.tripleBarrel = false;
          player.multipleBarrels();
        }, 10000);
        break;
    }
    soundEffects.powerup.play();
    powerUp.gained = true;
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
