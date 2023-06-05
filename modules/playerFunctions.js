import { canvas } from './gameArea.js';
import { AnimationSpriteSheet, Player } from './gameObjectsComponent.js';
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
const newPowerUp = new AnimationSpriteSheet(
  'double-barrel-sprite-sheet.png',
  30,
  30,
  175,
  0,
  100,
  100
);
newPowerUp.gained = true;
let randomNumber;
let totalFrames;
setInterval(() => {
  randomNumber = Math.floor(Math.random() * 3) + 1
  let srcWidth, srcHeight, destHeight, destWidth, spriteSheet;
  switch (randomNumber) {
    case 1:
      spriteSheet = 'double-health-sprite-sheet.png';
      srcWidth = 64;
      srcHeight = 64;
      destHeight = 30;
      destWidth = 30;
      totalFrames = 10;
      break;
    case 2:
      spriteSheet = 'double-barrel-sprite-sheet.png';
      srcWidth = 100;
      srcHeight = 100;
      destHeight = 40;
      destWidth = 40;
      totalFrames = 13;
      break;
    case 3:
      spriteSheet = 'triple-barrel-sprite-sheet.png';
      srcWidth = 129;
      srcHeight = 129;
      destHeight = 50;
      destWidth = 50;
      totalFrames = 13;
      break;
  }
  newPowerUp.spriteSheet = spriteSheet;
  newPowerUp.srcWidth = srcWidth;
  newPowerUp.srcHeight = srcHeight;
  newPowerUp.destHeight = destHeight;
  newPowerUp.destWidth = destWidth;
  const randomXaxis = Math.floor(Math.random() * 300);
  newPowerUp.destX = randomXaxis;
  newPowerUp.destY = -50;
  newPowerUp.gained = false;
}, 13000);

let pastTime = Date.now();
const powerUpFrames = () => {
  const currentTime = Date.now();
  const delta = currentTime - pastTime;
  if (delta >= 100) {
    if(newPowerUp.gained) {
      totalFrames = 0;
    }
    newPowerUp.frames(totalFrames);
    pastTime = currentTime;
  }
};

const renderPowerUps = () => {
  if (newPowerUp.destY > canvas.height + 50) {
    newPowerUp.gained = true;
  }
  if (
    newPowerUp.destY + newPowerUp.destHeight> player.y - player.height / 2 &&
    newPowerUp.destY < player.y + player.height / 2 &&
    newPowerUp.destX + newPowerUp.destWidth > player.x - player.height / 2 &&
    newPowerUp.destX < player.x + player.height / 2 &&
    !newPowerUp.gained
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
    newPowerUp.gained = true;
  }
  if (!newPowerUp.gained) {
    newPowerUp.movement(0, 3);
    newPowerUp.update();
  }
};

// let lastTime = Date.now();
// const animateSpriteSheet = () => {
//   const currentTime = Date.now();
//   const delta = currentTime - lastTime;
//   if (delta >= 100) {
//     lastTime = currentTime;
//   }
// };

export const playerFunctions = () => {
  powerUpFrames();
  mouseController();
  isTouchDevice && touchController();
  renderPowerUps();
  !player.animationFinished && player.update();
};
