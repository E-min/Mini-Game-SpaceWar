import { enemiesFunctions } from "./enemyFunctions.js";
import { GameObjectsComponent } from "./gameObjectsComponent.js";
import { playerFunctions } from "./playerFunctions.js";

const canvas = document.getElementById('canvas');
canvas.height = 600;
canvas.width = 350;

export const gameArea = {
  canvas: document.getElementById('canvas'),
  fps: 60,
  miliseconds: Date.now(),
  start: function () {
    this.context = this.canvas.getContext("2d");
    let previousTime = this.miliseconds;
    const frameRefresher = () => {
      const currentTime = Date.now();
      const delta = currentTime - previousTime;
      if (delta >= 1000 / this.fps) {
        updateGameArea();
        previousTime = currentTime;
      }
      requestAnimationFrame(frameRefresher);
    };
    frameRefresher();
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

const backgroundFirst = new GameObjectsComponent(
  canvas.height,
  canvas.width,
  "background-repeat-1.png",
  canvas.width / 2,
  -canvas.height / 2
);
const backgroundSecond = new GameObjectsComponent(
  canvas.height,
  canvas.width,
  "background-repeat-2.png",
  canvas.width / 2,
  canvas.height / 2
);
// place functions that renders in game
export const updateGameArea = () => {
  gameArea.clear();
  backgroundRepeat();
  playerFunctions();
  enemiesFunctions()
};

const backgroundRepeat = () => {
  backgroundSecond.update();
  backgroundFirst.update();
  backgroundFirst.angle = 90;
  backgroundSecond.angle = 90;
  backgroundFirst.movement(0, 5);
  backgroundSecond.movement(0, 5);
  backgroundFirst.y >= canvas.height + (canvas.height / 2) &&
    ((backgroundFirst.y = -canvas.height / 2), (backgroundFirst.angle += 90));
  backgroundSecond.y >= canvas.height + (canvas.height / 2) &&
    ((backgroundSecond.y = -canvas.height / 2), (backgroundSecond.angle -= 90));
};
