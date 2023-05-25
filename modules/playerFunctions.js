import { GameObjectsComponent } from "./gameObjectsComponent.js";
import { keys } from "./inputController.js";

export const player = new GameObjectsComponent(40, 40, "player.png", 175, 400);

const playerSpeed = 2;
let playerSpeedX;
let playerSpeedY;

const movement = () => {
  const right = keys.rightKeyPressed;
  const left = keys.leftKeyPressed;
  const up = keys.upKeyPressed;
  const down = keys.downKeyPressed;
  if (up) {
    playerSpeedY = -playerSpeed;
  } else if (down) {
    playerSpeedY = playerSpeed;
  } else {
    playerSpeedY = 0;
  }
  if (left && !right) {
    playerSpeedX = -playerSpeed;
  }
  if (right && !left) {
    playerSpeedX = playerSpeed;
  }
  if (!right && !left) {
    playerSpeedX = 0;
  }
  player.movement(playerSpeedX, playerSpeedY);
};

export const evade = (direction) => {
  animate(direction);
};
const animate = (direction) => {
  let travelRange;
  if (direction === "right") {
    travelRange = 5;
  } else {
    travelRange = -5;
  }
  const duration = 200;
  const startAnimate = Date.now();
  const update = () => {
    const currentTime = Date.now();
    const elapsed = currentTime - startAnimate;
    player.movement(travelRange, playerSpeedY);
    if (elapsed < duration) {
      requestAnimationFrame(update);
    }
  };
  requestAnimationFrame(update);
};

export const bullets = [];
let pastTime = Date.now();
let index = 0;
const maxBulletAmount = 10;

const bulletGenerator = () => {
  const currentTime = Date.now();
  const delta = currentTime - pastTime;
  if (delta >= 300) {
    if (bullets.length < maxBulletAmount) {
      bullets.push(
        new GameObjectsComponent(
          7,
          20,
          "small-red-bullet.png",
          player.x,
          player.y
        )
      );
    }
    if (index === bullets.length) {
      index = 0;
    }
    if (bullets.length === maxBulletAmount) {
      bullets[index].hit = false;
      bullets[index].x = player.x;
      bullets[index].y = player.y;
      bullets[index].width = 7;
      index++;
    }
    pastTime = currentTime;
  }
  requestAnimationFrame(bulletGenerator);
};
requestAnimationFrame(bulletGenerator);

const renderBullets = () => {
  for (let i = 0; i < bullets.length; i++) {
    if (!bullets[i].hit) bullets[i].movement(0, -5);
    bullets[i].update();
  }
};

export const playerFunctions = () => {
  movement();
  player.update();
  renderBullets();
};
