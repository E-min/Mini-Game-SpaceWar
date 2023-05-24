import { evade } from "./playerFunctions.js";

// const buttons = document.querySelectorAll(".buttons");
export const keys = {
  leftKeyPressed: false,
  rightKeyPressed: false,
  upKeyPressed: false,
  downKeyPressed: false,
};

const keyPress = () => {
  //******************************************
  // event listener for on secreen buttons
  //   buttons.forEach((button) => {
  //     button.addEventListener("touchstart", (event) => {
  //       switch (event.target.value) {
  //         case "right":
  //           event.preventDefault();
  //           keys.rightKeyPressed = true;
  //           break;
  //         case "left":
  //           event.preventDefault();
  //           keys.leftKeyPressed = true;
  //           break;
  //         case "rotate":
  //           keys.upKeyPressed = true;
  //           break;
  //         case "faster":
  //           keys.downKeyPressed = true;
  //           break;
  //       }
  //     });
  //     button.addEventListener("touchend", (event) => {
  //       switch (event.target.value) {
  //         case "faster":
  //           keys.downKeyPressed = false;
  //           break;
  //       }
  //     });
  //   });
  
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
        evade('right');
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
      evade('left');
    } else {
      firstKeyCycleLeftTime = currentTime;
    }
  }
};
keyPress();
