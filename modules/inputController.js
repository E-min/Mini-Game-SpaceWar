import { evade } from "./playerFunctions.js";
export const isTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

// const buttons = document.querySelectorAll(".buttons");
export const keys = {
  leftKeyPressed: false,
  rightKeyPressed: false,
  upKeyPressed: false,
  downKeyPressed: false,
};
export const touchLocation = {
  touchX: 0,
  touchY: 0,
  onTouch: false
};

//*******************************Touch Cordinates*******************************
// Get the canvas element
const canvas = document.getElementById("canvas");

// Variables to store touch coordinates
let touchX, touchY;

// Touch start event handler
const handleTouchStart = function (event) {
  event.preventDefault();
  const touch = event.touches[0];
  touchLocation.onTouch = true;
  touchX = touch.clientX - canvas.offsetLeft;
  touchY = touch.clientY - canvas.offsetTop;
};

// Touch move event handler
const handleTouchMove = function (event) {
  event.preventDefault();
  const touch = event.touches[0];
  touchX = touch.clientX - canvas.offsetLeft;
  touchY = touch.clientY - canvas.offsetTop;
};

// Touch end event handler
const handleTouchEnd = function (event) {
  event.preventDefault();
  const touch = event.changedTouches[0];
  touchLocation.onTouch = false;
  touchX = touch.clientX - canvas.offsetLeft;
  touchY = touch.clientY - canvas.offsetTop;
};
// Add touch event listeners to the canvas
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);
canvas.addEventListener("touchend", handleTouchEnd, false);

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

const keyPress = () => {
  //******************************************
  // event listener for keyboard keys
  document.addEventListener("keydown", function (event) {
    switch (event.code) {
      case "ArrowLeft":
        keys.leftKeyPressed = true;
        break;
      case "ArrowRight":
        keys.rightKeyPressed = true;
        break;
      case "ArrowUp":
        keys.upKeyPressed = true;
        break;
      case "ArrowDown":
        keys.downKeyPressed = true;
        break;
    }
  });
  document.addEventListener("keyup", function (event) {
    switch (event.code) {
      case "ArrowLeft":
        event.preventDefault();
        keys.leftKeyPressed = false;
        doubleTapLeft();
        break;
      case "ArrowRight":
        event.preventDefault();
        keys.rightKeyPressed = false;
        doubleTapRight();
        break;
      case "ArrowUp":
        event.preventDefault();
        keys.upKeyPressed = false;
        break;
      case "ArrowDown":
        event.preventDefault();
        keys.downKeyPressed = false;
        break;
    }
  });
};

let keyCycleLeft = 0;
let keyCycleRight = 0;
let firstKeyCycleLeftTime = 0;
let firstKeyCycleRightTime = 0;

const doubleTapRight = () => {
  if (keyCycleRight === 0) {
    keyCycleRight = 1;
    firstKeyCycleRightTime = Date.now();
  } else if (keyCycleRight === 1) {
    const currentTime = Date.now();
    if (currentTime - firstKeyCycleRightTime < 300) {
      keyCycleRight = 0;
      evade("right");
    } else {
      firstKeyCycleRightTime = currentTime;
    }
  }
};

const doubleTapLeft = () => {
  if (keyCycleLeft === 0) {
    keyCycleLeft = 1;
    firstKeyCycleLeftTime = Date.now();
  } else if (keyCycleLeft === 1) {
    const currentTime = Date.now();
    if (currentTime - firstKeyCycleLeftTime < 300) {
      keyCycleLeft = 0;
      evade("left");
    } else {
      firstKeyCycleLeftTime = currentTime;
    }
  }
};
keyPress();
