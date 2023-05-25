import { GameObjectsComponent } from "./gameObjectsComponent.js";
import { bullets } from "./playerFunctions.js";

class EnemiesComponent extends GameObjectsComponent {
  constructor(width, height, textureName, x, y) {
    super();
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.textureName = textureName;
    this.angle = 0;
    this.destroyed = false;
    this.animationTime = 300;
  }
  movement(moveX, moveY) {
    if (!this.destroyed) {
      this.x += moveX;
      this.y += moveY;
    }
  }
  //*******************************************************************
  expolision() {
    const lastXBeforeExpolision = this.x;
    const lastYBeforeExpolision = this.y;
    let startExpolision = Date.now();
    this.destroyed = true;
    let animateFrames = 1;
    const update = () => {
      const currentTime = Date.now();
      const delta = currentTime - startExpolision;
      if (animateFrames === 6) {
        return;
      }
      if (delta >= this.animationTime / 5) {
        this.width = 30;
        this.height = 30;
        this.angle = 0;
        this.textureName = `expolision-frame-${animateFrames}.png`;
        animateFrames++;
        startExpolision = currentTime;
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  //*******************************************************************
  damageDetect(causeOfObjects) {
    const frontFace = this.y + this.height / 2;
    const backFace = this.y - this.height / 2;
    const right = this.x + this.width / 2;
    const left = this.x - this.width / 2;
    for (let i = 0; i < causeOfObjects.length; i++) {
      if (
        causeOfObjects[i].y < frontFace &&
        causeOfObjects[i].y > backFace &&
        causeOfObjects[i].x < right &&
        causeOfObjects[i].x > left
      ) {
        this.expolision();
        causeOfObjects[i].hit = true;
        causeOfObjects[i].width = 0;
      }
    }
  }
  //*******************************************************************
  animationChain(...orders) {
    let currentOrderIndex = 0;
    const totalFramesOnEachAnimationSet = 50;
    const animateOrder = () => {
      const order = orders[currentOrderIndex];
      let lastTime = Date.now();
      let animateFrames = 1;

      const update = () => {
        const currentTime = Date.now();
        const delta = currentTime - lastTime;

        if (animateFrames === totalFramesOnEachAnimationSet) {
          currentOrderIndex++; // Move to the next order
          if (currentOrderIndex < orders.length) {
            // If there are more orders, animate the next one
            animateOrder();
          }
          return;
        }
        let velocityX;
        let velocityY;
        const startX = orders[currentOrderIndex].startX;
        const startY = orders[currentOrderIndex].startY;
        const finishX = orders[currentOrderIndex].finishX;
        const finishY = orders[currentOrderIndex].finishY;
        const motionType = orders[currentOrderIndex].motionType;
        if (motionType === "straight") {
          velocityX = (finishX - startX) / totalFramesOnEachAnimationSet;
          velocityY = (finishY - startY) / totalFramesOnEachAnimationSet;
        }
        if (animateFrames === 1) {
          this.x = startX;
          this.y = startY;
        }
        if (delta >= 1000 / 60) {
          this.movement(velocityX, velocityY);

          animateFrames++;
          lastTime = currentTime;
        }
        requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    // Start the animation chain
    if (orders.length > 0) {
      animateOrder();
    }
  }
}

const enemyDrones = [];
for (let i = 0; i < 2; i++) {
  const enemyDrone = new EnemiesComponent(
    20,
    20,
    "enemy-mini-drone.png",
    175,
    30 + i * 30
  );
  enemyDrones.push(enemyDrone);
}

enemyDrones[1].animationChain(
  {
    startX: 100,
    startY: 100,
    finishX: 200,
    finishY: 150,
    motionType: "straight",
  },
  {
    startX: 200,
    startY: 150,
    finishX: 175,
    finishY: 300,
    motionType: "straight",
  }
);

const renderEnemies = () => {
  for (let i = enemyDrones.length - 1; i >= 0; i--) {
    if (!enemyDrones[i]) continue;
    enemyDrones[i].update();
    if (enemyDrones[i].destroyed) {
      const animationDuration = enemyDrones[i].animationTime;
      const extraTimeForLastFrame = animationDuration / 5;
      setTimeout(() => {
        enemyDrones[i] = null;
      }, animationDuration + extraTimeForLastFrame);
      continue;
    }
    enemyDrones[i].angle = 220;
    enemyDrones[i].damageDetect(bullets);
  }
};
export const enemiesFunctions = () => {
  renderEnemies();
};
