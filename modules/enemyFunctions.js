import { GameObjectsComponent } from "./gameObjectsComponent.js";
import { bullets } from "./playerFunctions.js";

class EnemiesComponent extends GameObjectsComponent {
  constructor(x, y, width, height, textureName, health) {
    super();
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.textureName = textureName;
    this.mainTexture = this.textureName.slice(0, -4)
    this.health = health;
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
    const mainTexture = this.mainTexture;
    const frontFace = this.y + this.height / 2;
    const backFace = this.y - this.height / 2;
    const right = this.x + this.width / 2;
    const left = this.x - this.width / 2;
    for (let i = 0; i < causeOfObjects.length; i++) {
      // if bullet did hit pass the collision check
      if (causeOfObjects[i].hit) continue;
      if (
        causeOfObjects[i].y < frontFace &&
        causeOfObjects[i].y > backFace &&
        causeOfObjects[i].x < right &&
        causeOfObjects[i].x > left
      ) {
        this.textureName = `${mainTexture}-hit.png`;
        const loadMainTexture = setTimeout(() => {
          if (this.destroyed) {
            clearTimeout(loadMainTexture);
          } else {
            this.textureName = `${mainTexture}.png`;
            this.y += 1;
          }
        }, 100);
        
        this.health--;
        if (this.health <= 0) this.expolision();
        this.y -= 3;
        causeOfObjects[i].hit = true;
      }
    }
  }
  //*******************************************************************
  animationChain(orders) {
    let currentOrderIndex = 0;
    const totalFramesOnEachAnimationSet = 40;
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
        // // angle calculation
        // const deltaX = finishX - startX;
        // const deltaY = finishY - startY;
        // const angleInRadians = Math.atan2(deltaY, deltaX);
        // const angleInDegrees = (angleInRadians * 180) / Math.PI;
        // // Ensure the angle is within the range of 0 to 360 degrees
        // const normalizedAngle = (angleInDegrees + 360) % 360;
        // this.angle = normalizedAngle + 180; // extra angle add to get frontface
        // //******************
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
//***********************new enemy add*********************************
const enemyDrones = [];
const enemySpawnPoint = {
  x: 175,
  y: -100,
};
for (let i = 0; i < 10; i++) {
  const enemyDrone = new EnemiesComponent(
    enemySpawnPoint.x,
    enemySpawnPoint.y,
    20,
    20,
    "enemy-mini-drone.png",
    5
  );
  enemyDrones.push(enemyDrone);
}
//*********************************************************************
//***********************enemy formations******************************
const gridTable = (...orders) => {
  let lastTime = Date.now();
  let enemyIndex = 0;
  const update = () => {
    const currentTime = Date.now();
    const delta = currentTime - lastTime;
    if (enemyIndex === enemyDrones.length - 1 || !enemyDrones[enemyIndex]) {
      return;
    }
    //***********grid positions*****************
    const moveSets = [];
    const enemyStartPoint = {
      x: enemySpawnPoint.x,
      y: enemySpawnPoint.y,
    };
    const words = "XABCDEFGHIJK";
    const gridwidth = 35;
    for (let i = 0; i < orders[enemyIndex].length; i++) {
      const firstLetter = orders[enemyIndex][i][0];
      const SecondNumber = orders[enemyIndex][i][1];
      const xAxis =
          firstLetter === "X"
          ? -2 * gridwidth
          : words.indexOf(firstLetter) * gridwidth;
      const yAxis = SecondNumber * gridwidth;
      const moveSet = {
        startX: enemyStartPoint.x,
        startY: enemyStartPoint.y,
        finishX: xAxis,
        finishY: yAxis,
        motionType: "straight",
      };
      moveSets.push(moveSet);
      enemyStartPoint.x = xAxis;
      enemyStartPoint.y = yAxis;
    }
    //********************************************
    //************* iteration section*************
    if (delta >= 500) {
      enemyDrones[enemyIndex].animationChain(moveSets);
      enemyIndex++;
      lastTime = currentTime;
    }
    //********************************************
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};
//********************************************************************
gridTable(
  ["A1", "C1", "E1", "G1", "I1", "I3", "G3", "E3", "C3", "A3", "X1"],
  ["A1", "C1", "E1", "G1", "I1", "I3", "G3", "E3", "C3", "A3", "X1"],
  ["A1", "C1", "E1", "G1", "I1", "I3", "G3", "E3", "C3", "A3", "X1"],
  ["A1", "C1", "E1", "G1", "I1", "I3", "G3", "E3", "C3", "A3", "X1"],
  ["A1", "C1", "E1", "G1", "I1", "I3", "G3", "E3", "C3", "A3", "X1"],
  ["A1", "C1", "E1", "G1", "I1", "I3", "G3", "E3", "C3", "A3", "X1"],
  ["A1", "C1", "E1", "G1", "I1", "I3", "G3", "E3", "C3", "A3", "X1"],
  ["A1", "C1", "E1", "G1", "I1", "I3", "G3", "E3", "C3", "A3", "X1"],
  ["A1", "C1", "E1", "G1", "I1", "I3", "G3", "E3", "C3", "A3", "X1"],
);

const renderEnemies = () => {
  for (let i = enemyDrones.length - 1; i >= 0; i--) {
    if (!enemyDrones[i]) {
      continue;
    }
    enemyDrones[i].update();
    if (enemyDrones[i].destroyed) {
      const animationDuration = enemyDrones[i].animationTime;
      const extraTimeForLastFrame = animationDuration / 5;
      setTimeout(() => {
        enemyDrones[i] = null;
      }, animationDuration + extraTimeForLastFrame);
      continue;
    }
    enemyDrones[i].angle = 270;
    enemyDrones[i].damageDetect(bullets);
  }
};
export const enemiesFunctions = () => {
  renderEnemies();
};