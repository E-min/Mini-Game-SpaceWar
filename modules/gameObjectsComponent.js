import { gameArea } from './gameArea.js';
import { soundEffects } from './gameSoundEffects.js';
import { textureImages } from './preLoadTextures.js';

// root of all objects in game******************************************
export class GameObjectsComponent {
  constructor(width, height, textureName, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.textureName = textureName;
    this.angle = 0;
    this.hit = false;
  }
  update() {
    const context = gameArea.context;
    const texture = textureImages[`./textures/${this.textureName}`];
    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.angle * Math.PI) / 180);
    context.drawImage(texture, this.width / -2, this.height / -2, this.width, this.height);
    context.restore();
  }
  movement(moveX = 0, moveY = 0) {
    this.x += moveX;
    this.y += moveY;
  }
  rotation(rotationAngle) {
    this.angle += rotationAngle;
  }
}
//***************************************************************
export class Player extends GameObjectsComponent {
  constructor(x, y, width, height, textureName, health) {
    super();
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.textureName = textureName;
    this.mainTexture = this.textureName.slice(0, -4);
    this.health = health;
    this.destroyed = false;
    this.animationFinished = false;
  }
  exploison() {
    const explosionDuration = 300;
    this.destroyed = true;
    let startExpolision = Date.now();
    let animateFrames = 1;
    const objectWidth = this.width;
    const objectHeight = this.height;
    const randomExploison = Math.floor(Math.random() * 3);
    const exploisonSound = soundEffects[`exploison${randomExploison}`];
    exploisonSound.volume = 0.05;
    if (!exploisonSound.paused) {
      exploisonSound.pause();
      exploisonSound.currentTime = 0;
    }
    exploisonSound.play();
    const update = () => {
      const currentTime = Date.now();
      const delta = currentTime - startExpolision;
      if (animateFrames === 6) {
        // time delay for last frame
        setTimeout(() => {
          this.animationFinished = true;
        }, 100);
        return;
      }
      if (delta >= explosionDuration / 5) {
        this.width = objectWidth + 10;
        this.height = objectHeight + 10;
        this.angle = 0;
        this.textureName = `exploison-frame-${animateFrames}.png`;
        animateFrames++;
        startExpolision = currentTime;
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
}
// blueprint for All enemies*******************************
export class EnemiesComponent extends GameObjectsComponent {
  constructor(x, y, width, height, textureName, health, bulletAmount) {
    super();
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.textureName = textureName;
    this.mainTexture = this.textureName.slice(0, -4);
    this.health = health;
    this.angle = 0;
    this.destroyed = false;
    this.animationFinished = false;
    this.bulletAmount = bulletAmount;
    this.enemyBullets = [];
    this.bullets();
  }
  bulletUpdate(player) {
    let playerHit = false;
    for (let i = 0; i < this.enemyBullets.length; i++) {
      const bullet = this.enemyBullets[i];
      if (bullet.hit) {
        continue;
      }
      if (!bullet.hit) {
        bullet.movement(0, 10);
        bullet.update();
      }
      if (
        player.y - player.height / 2 <= bullet.y &&
        player.y + player.height / 2 >= bullet.y &&
        player.x - player.width / 2 <= bullet.x &&
        player.x + player.width / 2 >= bullet.x
      ) {
        bullet.hit = true;
        playerHit = true;
      }
    }
    if (playerHit) {
      player.health--;
      player.health === 0 && player.exploison();
      playerHit = false;
    }
  }
  movement(moveX, moveY) {
    if (!this.destroyed) {
      this.x += moveX;
      this.y += moveY;
    }
  }
  bullets() {
    let lastTime = Date.now();
    let bulletCycle = 0;
    let index = 0;
    const update = () => {
      const randomBulletDelay = (Math.floor(Math.random() * 5) + 3) * 1000;
      const currentTime = Date.now();
      const delta = currentTime - lastTime;
      if (delta >= randomBulletDelay) {
        if (this.destroyed) return;
        if (bulletCycle !== this.bulletAmount - 1) {
          const newBullet = new GameObjectsComponent(10, 10, 'green-orb.png', this.x, this.y);
          this.enemyBullets.push(newBullet);
          bulletCycle++;
        }
        if (index === this.bulletAmount - 1) {
          index = 0;
        } else {
          const bullet = this.enemyBullets[index];
          bullet.hit = false;
          bullet.x = this.x;
          bullet.y = this.y;
          index++;
        }
        lastTime = currentTime;
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
  //******************************************
  exploison() {
    const explosionDuration = 300;
    this.destroyed = true;
    let startExpolision = Date.now();
    let animateFrames = 1;
    const objectWidth = this.width;
    const objectHeight = this.height;
    const randomExploison = Math.floor(Math.random() * 3);
    const exploisonSound = soundEffects[`exploison${randomExploison}`];
    exploisonSound.volume = 0.05;
    if (!exploisonSound.paused) {
      exploisonSound.pause();
      exploisonSound.currentTime = 0;
    }
    exploisonSound.play();
    const update = () => {
      const currentTime = Date.now();
      const delta = currentTime - startExpolision;
      if (animateFrames === 6) {
        // time delay for last frame
        setTimeout(() => {
          this.animationFinished = true;
        }, 100);
        return;
      }
      if (delta >= explosionDuration / 5) {
        this.width = objectWidth + 10;
        this.height = objectHeight + 10;
        this.angle = 0;
        this.textureName = `exploison-frame-${animateFrames}.png`;
        animateFrames++;
        startExpolision = currentTime;
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  //******************************************
  damageDetect(causeOfObjects) {
    const mainTexture = this.mainTexture;
    const frontFace = this.y + this.height / 2;
    const backFace = this.y - this.height / 2;
    const right = this.x + this.width / 2;
    const left = this.x - this.width / 2;
    for (let i = 0; i < causeOfObjects.length; i++) {
      // if bullet did hit, pass the collision check
      if (causeOfObjects[i].hit) continue;
      if (
        causeOfObjects[i].y < frontFace &&
        causeOfObjects[i].y > backFace &&
        causeOfObjects[i].x < right &&
        causeOfObjects[i].x > left
      ) {
        this.textureName = `${mainTexture}-hit.png`;
        const loadMainTexture = setTimeout(() => {
          if (this.destroyed || this.health === 1) {
            clearTimeout(loadMainTexture);
          } else {
            this.textureName = `${mainTexture}.png`;
            this.movement(0, 1);
          }
        }, 100);

        this.health--;
        if (this.health <= 0) this.exploison();
        this.movement(0, -3);
        causeOfObjects[i].hit = true;
      }
    }
  }
  //******************************************
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
        const startX = order.startX;
        const startY = order.startY;
        const finishX = order.finishX;
        const finishY = order.finishY;
        const motionType = order.motionType;
        if (motionType === 'straight') {
          velocityX = (finishX - startX) / totalFramesOnEachAnimationSet;
          velocityY = (finishY - startY) / totalFramesOnEachAnimationSet;
        }
        if (animateFrames === 1) {
          this.x = startX;
          this.y = startY;
        }
        if (delta >= 1000 / 60) {
          if (this.destroyed) {
            currentOrderIndex = orders.length;
            return;
          }
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
//**************************************************************
