// Object to store the loaded texture images
export const textureImages = {};

export const preloadTextures = function (callback) {
  // Array to store the paths of the texture images
  const texturePaths = [
    './textures/player.png',
    './textures/player-hit.png',
    './textures/health-low.png',
    './textures/health-mid.png',
    './textures/health-extra.png',
    './textures/double-barrel-sprite-sheet.png',
    './textures/triple-barrel-sprite-sheet.png',
    './textures/double-health-sprite-sheet.png',
    './textures/health-percent.png',
    './textures/background-repeat-1.png',
    './textures/background-repeat-2.png',
    './textures/small-red-bullet.png',
    './textures/medium-red-bullet.png',
    './textures/large-red-bullet.png',
    './textures/enemy-mini-drone.png',
    './textures/enemy-mini-ship.png',
    './textures/enemy-mini-ship-hit.png',
    './textures/enemy-mini-drone-hit.png',
    './textures/exploison-frame-1.png',
    './textures/exploison-frame-2.png',
    './textures/exploison-frame-3.png',
    './textures/exploison-frame-4.png',
    './textures/exploison-frame-5.png',
    './textures/green-orb.png',
  ];
  // Counter to keep track of the loaded texture images
  let loadedCount = 0;
  // Load the texture images
  texturePaths.forEach((path) => {
    const textureImg = new Image();
    textureImg.src = path;
    textureImg.onload = function () {
      loadedCount++;
      // Once all texture images are loaded, apply them to the canvas
      if (loadedCount === texturePaths.length) {
        callback();
      }
    };
    // Store the loaded texture image in the textureImages object
    textureImages[path] = textureImg;
  });
};
