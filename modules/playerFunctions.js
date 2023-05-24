import { gameArea } from "./gameArea.js";
import { GameObjectsComponent } from "./gameObjectsComponent.js";
import { keys } from "./inputController.js";

export const player = new GameObjectsComponent(40, 40, "player.png", 175, 400);

let playerSpeedY;
const movement = () => {
  if (keys.upKeyPressed) {
    player.movement(0, -2);
    playerSpeedY = -2;
  } else if (keys.downKeyPressed) {
    player.movement(0, 2);
    playerSpeedY = 2;
  } else {
    playerSpeedY = 0;
  }
  if (keys.leftKeyPressed) {
    player.movement(-2, 0);
  } else if (keys.rightKeyPressed) {
    player.movement(2, 0);
  }
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

const bullets = [];
let pastTime = Date.now();

const bulletGenerator = () => {
  const currentTime = Date.now();
  const delta = currentTime - pastTime;
  if (delta >= 100) {
    if (bullets.length <= 10) {
      bullets.push(
        new GameObjectsComponent(7, 10, "small-red-bullet.png", 0, 0)
      );
    }
    pastTime = currentTime;
  }
  requestAnimationFrame(bulletGenerator);
};
requestAnimationFrame(bulletGenerator);

const renderBullets = () => {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].movement(0, -5);
    bullets[i].update();
    if (
      bullets[i].y < 0 ||
      bullets[i].y > gameArea.canvas.height ||
      bullets[i].x < 0 ||
      bullets[i].x > gameArea.canvas.width
    ) {
      bullets[i].y = player.y;
      bullets[i].x = player.x;
    }
  }
};

export const playerFunctions = () => {
  movement();
  player.update();
  renderBullets();
};
