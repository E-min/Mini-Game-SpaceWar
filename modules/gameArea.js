import { enemyFunctions } from "./EnemyFunctions.js";
import { GameObjectsComponent } from "./gameObjectsComponent.js";
import { playerFunctions } from "./playerFunctions.js";

const globalMilisecond = Date.now()
export const gameArea = {
  canvas: document.createElement("canvas"),
  fps: 60,
  miliseconds: Date.now(),
  start: function () {
    this.canvas.height = 500;
    this.canvas.width = 350;
    this.context = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
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
  500,
  350,
  "background-repeat-1.png",
  175,
  -250
);
const backgroundSecond = new GameObjectsComponent(
  500,
  350,
  "background-repeat-2.png",
  175,
  250
);
// place functions that renders in game
export const updateGameArea = () => {
  gameArea.clear();
  backgroundRepeat();
  playerFunctions();
  enemyFunctions()
};

const backgroundRepeat = () => {
  backgroundSecond.update();
  backgroundFirst.update();
  backgroundFirst.angle = 90;
  backgroundSecond.angle = 90;
  backgroundFirst.movement(0, 1);
  backgroundSecond.movement(0, 1);
  backgroundFirst.y > 750 &&
    ((backgroundFirst.y = -240), (backgroundFirst.angle += 90));
  backgroundSecond.y > 750 &&
    ((backgroundSecond.y = -240), (backgroundSecond.angle -= 90));
};
