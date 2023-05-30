import { gameArea } from './gameArea.js';
import { soundEffects } from './gameSoundEffects.js';
import { mouseLocation, touchLocation } from './inputController.js';
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
    this.bullets = [];
    this.maxHealth = this.health
    this.doubleHealth = false;
    this.bulletGenerator();
    this.healthBarFirst = new GameObjectsComponent(5, 30, 'health-percent.png', this.x + 30, this.y)
    this.healthBarSecond = new GameObjectsComponent(5, 30, 'health-extra.png', this.x + 38, this.y)
  }
  healthBar() {
    this.healthBarFirst.x = this.x + 30;
    this.healthBarFirst.y = this.y;
    this.healthBarSecond.x = this.x + 38;
    this.healthBarSecond.y = this.y;
    if(this.health > this.maxHealth) {
      this.healthBarFirst.textureName = 'health-percent.png';
      this.healthBarSecond.height = ((this.health % 11)* 3) + 3;
      this.healthBarFirst.height = this.maxHealth * 3;
    } else {
      this.healthBarSecond.height = 0;
      this.healthBarFirst.height = this.health * 3;
    }
    if(this.health / this.maxHealth <= 0.2) {
      this.healthBarFirst.textureName = 'health-low.png';
    } else if (this.health / this.maxHealth <= 0.5) {
      this.healthBarFirst.textureName = 'health-mid.png'
    }
    this.healthBarFirst.update()
    this.doubleHealth && this.healthBarSecond.update()
  }

  bulletGenerator() {
    let index = 0;
    let maxBulletAmount;
    setInterval(() => {
      const smallBulletSpawnX = this.x;
      const smallBulletSpawnY = this.y - 20;
      // stop or continue bullet firing
      if (touchLocation.onTouch || mouseLocation.leftClick) {
        maxBulletAmount = 7;
      } else {
        maxBulletAmount = 0;
      }
      this.destroyed && (maxBulletAmount = 0);
      //******************************
      //laser sound ******************
      const randomLaser = Math.floor(Math.random() * 3);
      const laserSound = soundEffects[`laser${randomLaser}`];
      laserSound.volume = 0.01;
      if (maxBulletAmount) {
        !laserSound.paused && (laserSound.currentTime = 0);
        laserSound.play();
      }
      //******************************
      //add bullets to pool***********
      if (this.bullets.length < maxBulletAmount) {
        this.bullets.push(
          new GameObjectsComponent(
            7,
            20,
            'small-red-bullet.png',
            smallBulletSpawnX,
            smallBulletSpawnY
          )
        );
      }
      //******************************
      if (index === this.bullets.length) {
        index = 0;
      }
      //reuse old bullets to create rapid firing
      if (this.bullets.length === maxBulletAmount && maxBulletAmount) {
        this.bullets[index].hit = false;
        this.bullets[index].x = smallBulletSpawnX;
        this.bullets[index].y = smallBulletSpawnY;
        index++;
      }
      //******************************
    }, 200);
  }
  update() {
    super.update();
    this.renderBullets();
    this.healthBar();
  }
  renderBullets() {
    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      if (!bullet.hit) {
        bullet.movement(0, -10);
        bullet.update();
      }
    }
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
  constructor(x, y, width, height, textureName, health, bulletAmount, bulletTexture) {
    super();
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.textureName = textureName;
    this.mainTexture = this.textureName.slice(0, -4);
    this.bulletTexture = bulletTexture;
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
        bullet.movement(0, 7);
        bullet.update();
      }
      // bullet to bullet collision
      for (let j = 0; j < player.bullets.length; j++) {
        if (player.bullets[j].hit) {
          continue;
        }
        if (
          player.bullets[j].y - 8 <= bullet.y &&
          player.bullets[j].y + 8 >= bullet.y &&
          player.bullets[j].x - 8 <= bullet.x &&
          player.bullets[j].x + 8 >= bullet.x
        ) {
          bullet.hit = true;
          player.bullets[j].hit = true;
        }
      }
      //******************************
      if (
        player.y - player.height / 2 <= bullet.y &&
        player.y + player.height / 2 >= bullet.y &&
        player.x - player.width / 2 <= bullet.x &&
        player.x + player.width / 2 >= bullet.x
      ) {
        if (player.health > 0) {
          bullet.hit = true;
          playerHit = true;
        }
      }
    }
    if (playerHit) {
      player.health--;
      if (player.health <= 0) {
        player.exploison();
        return;
      }
      player.textureName = 'player-hit.png';
      const hitSound = soundEffects.hit;
      hitSound.volume = 0.1;
      if (!hitSound.paused) {
        hitSound.currentTime = 0;
      }
      hitSound.play();
      setTimeout(() => {
        player.textureName = 'player.png';
      }, 200);
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
    let randomBulletDelay = (Math.floor(Math.random() * 5) + 1) * 800;
    const update = () => {
      const currentTime = Date.now();
      const delta = currentTime - lastTime;
      if (delta >= randomBulletDelay) {
        if (this.destroyed) return;
        if (bulletCycle !== this.bulletAmount - 1) {
          const newBullet = new GameObjectsComponent(10, 10, this.bulletTexture, this.x, this.y);
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
