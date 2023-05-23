import { GameObjectsComponent } from "./gameObjectsComponent.js";
import { keys } from "./inputController.js";

export const player = new GameObjectsComponent(40, 40, "player.png", 175, 400);

const movement = () => {
  if (keys.upKeyPressed) {
    player.movement(0, -2);
  } else if (keys.downKeyPressed) {
    player.movement(0, 2);
  }
  if (keys.leftKeyPressed) {
    player.movement(-2, 0);
  } else if (keys.rightKeyPressed) {
    player.movement(2, 0);
  }
};
export const evade = (direction) => {
  if(direction === "right") {
    player.movement(50, 0);
  } else {
    player.movement(-50, 0);
  }
    
}
export const playerFunctions = () => {
  movement();
  player.update()
};
