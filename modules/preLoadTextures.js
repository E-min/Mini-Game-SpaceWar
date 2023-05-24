// Object to store the loaded texture images
export const textureImages = {};

export const preloadTextures = function(callback) {
  // Array to store the paths of the texture images
  const texturePaths = [
    "./textures/player.png",
    "./textures/background-repeat-1.png",
    "./textures/background-repeat-2.png",
    "./textures/small-red-bullet.png",
    "./textures/enemy-mini-drone.png",
    "./textures/expolision-frame-1.png",
    "./textures/expolision-frame-2.png",
    "./textures/expolision-frame-3.png",
    "./textures/expolision-frame-4.png",
    "./textures/expolision-frame-5.png",
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
