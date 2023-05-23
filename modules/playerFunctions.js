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
  const update = () => {
    const currentTime = Date.now();
    const delta = currentTime - pastTime;
    if (delta >= 200) {
      const newBullet = new GameObjectsComponent(
        7,
        10,
        "small-red-bullet.png",
        player.x + 18,
        player.y + 5
      );
      bullets.push(newBullet);
      pastTime = currentTime;
    }
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};
const renderBullets = () => {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].movement(0, -5);
    bullets[i].update();
    if (
      bullets[i].y < 0 ||
      bullets[i].y > gameArea.canvas.height ||
      bullets[i].x < 0 ||
      bullets[i].x > gameArea.canvas.width
    ) {
      bullets.splice(i, 1);
    }
  }
};
export const playerFunctions = () => {
  movement();
  player.update();
  bulletGenerator();
  renderBullets();
};
