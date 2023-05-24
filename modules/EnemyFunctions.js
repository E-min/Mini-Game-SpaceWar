import { GameObjectsComponent } from "./gameObjectsComponent.js";
import { bullets } from "./playerFunctions.js";

let startExpolision = Date.now();
let animateFrames = 1;
class Enemies extends GameObjectsComponent {
  constructor(width, height, textureName, x, y) {
    super();
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.textureName = textureName;
    this.angle = 0;
  }
  expolision() {
    const update = () => {
      const currentTime = Date.now();
      const delta = currentTime - startExpolision;
      if (delta >= 200) {
        this.width = 30;
        this.height = 30;
        this.textureName = `expolision-frame-${animateFrames}.png`;
        startExpolision = currentTime;
        if (animateFrames === 5) {
          this.width = 0;
          this.height = 0;
          return;
        }
        animateFrames++;
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  damageDetect(causeOfObjects) {
    const frontFace = this.y + this.height / 2;
    const right = this.x + this.width / 2;
    const left = this.x - this.width / 2;
    for (let i = 0; i < causeOfObjects.length; i++) {
      if (
        causeOfObjects[i].y < frontFace &&
        causeOfObjects[i].x < right &&
        causeOfObjects[i].x > left
      ) {
        causeOfObjects[i].width = 0;
        this.expolision();
      }
    }
  }
}

const enemyDrone = new Enemies(20, 20, "enemy-mini-drone.png", 175, 100);
const generateEnemies = () => {
  enemyDrone.update();
  enemyDrone.damageDetect(bullets);
  //   enemyDrone.angle = 270;
};
export const enemyFunctions = () => {
  generateEnemies();
};
