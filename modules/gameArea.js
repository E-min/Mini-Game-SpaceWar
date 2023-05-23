import { playerFunctions } from "./playerFunctions.js";

export const gameArea = {
  canvas: document.createElement("canvas"),
  fps: 60,
  miliseconds: Date.now(),
  start: function () {
    this.canvas.height = 500;
    this.canvas.width = 350;
    this.context = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
    let previousTime = this.miliseconds;
    const frameRefresher = () => {
      const currentTime = Date.now();
      const delta = currentTime - previousTime;
      if (delta >= 1000 / this.fps) {
        updateGameArea();
        previousTime = currentTime;
      }
      requestAnimationFrame(frameRefresher);
    };
    frameRefresher();
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

// place functions that renders in game
export const updateGameArea = () => {
  gameArea.clear();
  playerFunctions();
};
