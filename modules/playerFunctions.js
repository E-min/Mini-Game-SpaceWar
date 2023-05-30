import { Player } from './gameObjectsComponent.js';
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
export const playerFunctions = () => {
  mouseController();
  isTouchDevice && touchController();
  !player.animationFinished && player.update();
};
