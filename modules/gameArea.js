import { enemiesFunctions } from './enemyFunctions.js';
import { GameObjectsComponent } from './gameObjectsComponent.js';
import { player, playerFunctions } from './playerFunctions.js';

export const canvas = document.getElementById('canvas');
canvas.height = 600;
canvas.width = 350;
let animateId;

export const gameArea = {
  canvas: document.getElementById('canvas'),
  start: function () {
    this.context = this.canvas.getContext('2d');
    const frameRefresher = () => {
      updateGameArea();
      animateId = requestAnimationFrame(frameRefresher);
      if (player.health <= 0) {
        cancelAnimationFrame(animateId);
        location.reload()
      }
    }; 
    requestAnimationFrame(frameRefresher);
  },
};
const backgroundFirst = new GameObjectsComponent(
  canvas.height,
  canvas.width,
  'background-repeat-1.png',
  canvas.width / 2,
  -canvas.height / 2
);
const backgroundSecond = new GameObjectsComponent(
  canvas.height,
  canvas.width,
  'background-repeat-2.png',
  canvas.width / 2,
  canvas.height / 2
);
// place functions that renders in game
export const updateGameArea = () => {
  backgroundRepeat();
  playerFunctions();
  enemiesFunctions();
};

const backgroundRepeat = () => {
  backgroundSecond.update();
  backgroundFirst.update();
  backgroundFirst.angle = 90;
  backgroundSecond.angle = 90;
  backgroundFirst.movement(0, 5);
  backgroundSecond.movement(0, 5);
  backgroundFirst.y >= canvas.height + canvas.height / 2 &&
    ((backgroundFirst.y = -canvas.height / 2), (backgroundFirst.angle += 90));
  backgroundSecond.y >= canvas.height + canvas.height / 2 &&
    ((backgroundSecond.y = -canvas.height / 2), (backgroundSecond.angle -= 90));
};
