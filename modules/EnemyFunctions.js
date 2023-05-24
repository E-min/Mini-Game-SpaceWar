import { GameObjectsComponent } from "./gameObjectsComponent.js";
import { bullets } from "./playerFunctions.js";

class Enemies extends GameObjectsComponent {
  constructor(width, height, textureName, x, y) {
    super();
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.textureName = textureName;
    this.angle = 0;
    this.destroyed = false;
  }
  expolision() {
    let startExpolision = Date.now();
    this.destroyed = true;
    let animateFrames = 1;
    const update = () => {
      const currentTime = Date.now();
      const delta = currentTime - startExpolision;
      if (animateFrames === 6) {
        this.width = 0;
        return;
      }
      if (delta >= 100) {
        this.width = 30;
        this.height = 30;
        this.textureName = `expolision-frame-${animateFrames}.png`;
        animateFrames++;
        startExpolision = currentTime;
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
        this.expolision();
        causeOfObjects[i].hit = true;
        causeOfObjects[i].width = 0;
      }
    }
  }
}
const enemyDrones = [];
for (let i = 0; i < 10; i++) {
  const enemyDrone = new Enemies(
    20,
    20,
    "enemy-mini-drone.png",
    175,
    30 + i * 30
  );
  enemyDrones.push(enemyDrone);
}
const renderEnemies = () => {
  for (let i = 0; i < enemyDrones.length; i++) {
    const enemydrone = enemyDrones[i];
    !enemydrone.destroyed && enemydrone.damageDetect(bullets);
    enemydrone.update();
  }
};
export const enemiesFunctions = () => {
  renderEnemies();
};
