import { canvas } from './gameArea.js';
import { AnimationSpriteSheet, Player } from './gameObjectsComponent.js';
import { soundEffects } from './gameSoundEffects.js';
import { mouseLocation } from './inputController.js';
import { touchLocation, isTouchDevice } from './inputController.js';
import createTimer from './stopWatch.js';

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
const propsOfPowerUps = [
  {
    spriteSheet: 'double-health-sprite-sheet.png',
    srcWidth: 64,
    srcHeight: 64,
    destHeight: 30,
    destWidth: 30,
    totalFrames: 10,
  },
  {
    spriteSheet: 'double-barrel-sprite-sheet.png',
    srcWidth: 100,
    srcHeight: 100,
    destHeight: 40,
    destWidth: 40,
    totalFrames: 13,
  },
  {
    spriteSheet: 'triple-barrel-sprite-sheet.png',
    srcWidth: 129,
    srcHeight: 129,
    destHeight: 50,
    destWidth: 50,
    totalFrames: 13,
  },
];
newPowerUp.gained = true;
let randomNumber;
let totalFrames;

// timers
const spawnPowerUp = createTimer();
const powerUpAnimation = createTimer();

const powerUpSpawnValues = () => {
  const randomXaxis = Math.floor(Math.random() * 300);
  randomNumber = Math.floor(Math.random() * 3);
  const selectedPowerUp = propsOfPowerUps[randomNumber];
  newPowerUp.spriteSheet = selectedPowerUp.spriteSheet;
  newPowerUp.srcWidth = selectedPowerUp.srcWidth;
  newPowerUp.srcHeight = selectedPowerUp.srcHeight;
  newPowerUp.destHeight = selectedPowerUp.destHeight;
  newPowerUp.destWidth = selectedPowerUp.destWidth;
  totalFrames = selectedPowerUp.totalFrames;
  newPowerUp.destX = randomXaxis;
  newPowerUp.destY = -50;
  newPowerUp.gained = false;
};

const renderPowerUps = () => {
  if (newPowerUp.destY > canvas.height + 50) {
    newPowerUp.gained = true;
  }
  if (
    newPowerUp.destY + newPowerUp.destHeight > player.y - player.height / 2 &&
    newPowerUp.destY < player.y + player.height / 2 &&
    newPowerUp.destX + newPowerUp.destWidth > player.x - player.height / 2 &&
    newPowerUp.destX < player.x + player.height / 2 &&
    !newPowerUp.gained
  ) {
    switch (randomNumber) {
      case 0:
        player.doubleHealth = true;
        player.health = player.maxHealth * 2;
        break;
      case 1:
        player.doubleBarrel = true;
        player.multipleBarrels();
        setTimeout(() => {
          player.doubleBarrel = false;
          player.multipleBarrels();
        }, 10000);
        break;
      case 2:
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


export const playerFunctions = () => {
  powerUpAnimation(
    () => newPowerUp.frames(totalFrames),
    100,
    () => newPowerUp.gained
  );
  spawnPowerUp(powerUpSpawnValues, 13000);
  mouseController();
  isTouchDevice && touchController();
  renderPowerUps();
  !player.animationFinished && player.update();
};
