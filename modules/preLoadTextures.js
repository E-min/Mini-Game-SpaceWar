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
    './textures/double-barrel-frames/double-barrel-0.png',
    './textures/double-barrel-frames/double-barrel-1.png',
    './textures/double-barrel-frames/double-barrel-2.png',
    './textures/double-barrel-frames/double-barrel-3.png',
    './textures/double-barrel-frames/double-barrel-4.png',
    './textures/double-barrel-frames/double-barrel-5.png',
    './textures/double-barrel-frames/double-barrel-6.png',
    './textures/double-barrel-frames/double-barrel-7.png',
    './textures/double-barrel-frames/double-barrel-8.png',
    './textures/double-barrel-frames/double-barrel-9.png',
    './textures/double-barrel-frames/double-barrel-10.png',
    './textures/double-barrel-frames/double-barrel-11.png',
    './textures/double-barrel-frames/double-barrel-12.png',
    './textures/triple-barrel-frames/triple-barrel-0.png',
    './textures/triple-barrel-frames/triple-barrel-1.png',
    './textures/triple-barrel-frames/triple-barrel-2.png',
    './textures/triple-barrel-frames/triple-barrel-3.png',
    './textures/triple-barrel-frames/triple-barrel-4.png',
    './textures/triple-barrel-frames/triple-barrel-5.png',
    './textures/triple-barrel-frames/triple-barrel-6.png',
    './textures/triple-barrel-frames/triple-barrel-7.png',
    './textures/triple-barrel-frames/triple-barrel-8.png',
    './textures/triple-barrel-frames/triple-barrel-9.png',
    './textures/triple-barrel-frames/triple-barrel-10.png',
    './textures/triple-barrel-frames/triple-barrel-11.png',
    './textures/triple-barrel-frames/triple-barrel-12.png',
    './textures/double-health-frames/double-health-0.png',
    './textures/double-health-frames/double-health-1.png',
    './textures/double-health-frames/double-health-2.png',
    './textures/double-health-frames/double-health-3.png',
    './textures/double-health-frames/double-health-4.png',
    './textures/double-health-frames/double-health-5.png',
    './textures/double-health-frames/double-health-6.png',
    './textures/double-health-frames/double-health-7.png',
    './textures/double-health-frames/double-health-8.png',
    './textures/double-health-frames/double-health-9.png',
    './textures/health-percent.png',
    './textures/background-repeat-1.png',
    './textures/background-repeat-2.png',
    './textures/small-red-bullet.png',
    './textures/medium-red-bullet.png',
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
