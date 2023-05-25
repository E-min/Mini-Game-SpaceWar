import { gameArea } from "./gameArea.js";
import { textureImages } from "./preLoadTextures.js";

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
    context.rotate(this.angle * Math.PI / 180);
    context.drawImage(
      texture,
      this.width / -2,
      this.height / -2,
      this.width,
      this.height
    );
    context.restore();
  }
  movement(moveX = 0, moveY = 0) {
    this.x += moveX;
    this.y += moveY;
  }
  rotation(rotationAngle) {
    this.angle += rotationAngle
  }
}
