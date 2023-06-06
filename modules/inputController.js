const canvas = document.getElementById('canvas');

export const isTouchDevice =
  'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

export const mouseLocation = {
  x: 0,
  y: 0,
  leftClick: false,
};
export const touchLocation = {
  touchX: 0,
  touchY: 0,
  onTouch: false,
};
// Add a mousemove event listener to the canvas
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouseLocation.x = event.clientX - rect.left;
  mouseLocation.y = event.clientY - rect.top;
});
canvas.addEventListener('mousedown', (event) => {
  if (event.button === 0) {
    // Check if the left mouse button is pressed
    mouseLocation.leftClick = true;
  }
});
canvas.addEventListener('mouseup', (event) => {
  if (event.button === 0) {
    // Check if the left mouse button is released
    mouseLocation.leftClick = false;
  }
});
//*******************************Touch Cordinates*******************************
let touchX, touchY;

// Touch start event handler
const handleTouchStart = (event) => {
  event.preventDefault();
  const touch = event.touches[0];
  touchLocation.onTouch = true;
  touchX = touch.clientX - canvas.offsetLeft;
  touchY = touch.clientY - canvas.offsetTop;
};

// Touch move event handler
const handleTouchMove = (event) => {
  event.preventDefault();
  const touch = event.touches[0];
  touchX = touch.clientX - canvas.offsetLeft;
  touchY = touch.clientY - canvas.offsetTop;
};

// Touch end event handler
const handleTouchEnd = (event) => {
  event.preventDefault();
  const touch = event.changedTouches[0];
  touchLocation.onTouch = false;
  touchX = touch.clientX - canvas.offsetLeft;
  touchY = touch.clientY - canvas.offsetTop;
};
// Add touch event listeners to the canvas
canvas.addEventListener('touchstart', handleTouchStart, false);
canvas.addEventListener('touchmove', handleTouchMove, false);
canvas.addEventListener('touchend', handleTouchEnd, false);

// Function to continuously read touch coordinates
const readTouchCoordinates = function () {
  touchLocation.touchX = touchX ? touchX : 0;
  touchLocation.touchY = touchY ? touchY : 0;
  // Request the next animation frame
  requestAnimationFrame(readTouchCoordinates);
};
// Start reading touch coordinates
isTouchDevice && readTouchCoordinates();
//*******************************************************************************
