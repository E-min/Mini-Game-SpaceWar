import { EnemiesComponent } from './gameObjectsComponent.js';
import { player } from './playerFunctions.js';

//***********************enemy informations******************************
const enemyTypes = ['mini-drone', 'mini-ship'];
const enemeyPaths = [
  'A1 B2 C3 D4 E5 F6 G7 H8 I9 K1',
  'I2 H3 G4 F5 E6 D7 C8 B9 A10 X1',
  'A1 C1 E1 G1 I1 I3 G3 E3 C3 A3 X1',
  'A2 C2 E2 G2 I2 I4 G4 E4 C4 A4 X1',
  'I2 G2 E2 C2 A2 A4 C4 E4 G4 I4 K1',
  'A1 C1 E1 G1 I1 I3 G3 E3 C3 A3 A5 C5 E5 G5 I5 I3 G3 E3 C3 A3 K1',
  'A2 C2 E2 G2 I2 I4 G4 E4 C4 A4 A6 C6 E6 G6 I6 I4 G4 E4 C4 A4 K1',
];
const enemyTeamsAppearingSequence = [
  '01 00 01 00 11 10 01 00 01 00 11 10',
  '13 14 01 01 02 13 14 01 01 02',
  '11 11 11 11 11 11 11 11 11 11',
];
//*********************************************************************

//***Create grid for game area and appearing sequence for enemies******
const gridTable = (...orders) => {
  let lastTime = Date.now();
  let enemyIndex = 0;
  const update = () => {
    const currentTime = Date.now();
    const delta = currentTime - lastTime;
    if (enemyIndex === currentEnemies.length || !currentEnemies[enemyIndex]) {
      return;
    }
    //***********grid positions*****************
    const moveSets = [];
    const enemyStartPoint = {
      x: enemySpawnPoint.x,
      y: enemySpawnPoint.y,
    };
    const words = 'XABCDEFGHIJK';
    const gridwidth = 35;
    for (let i = 0; i < orders[enemyIndex].length; i++) {
      const firstLetter = orders[enemyIndex][i][0];
      const SecondNumber = orders[enemyIndex][i][1];
      const xAxis = firstLetter === 'X' ? -2 * gridwidth : words.indexOf(firstLetter) * gridwidth;
      const yAxis = SecondNumber * gridwidth;
      const moveSet = {
        startX: enemyStartPoint.x,
        startY: enemyStartPoint.y,
        finishX: xAxis,
        finishY: yAxis
      };
      moveSets.push(moveSet);
      enemyStartPoint.x = xAxis;
      enemyStartPoint.y = yAxis;
    }
    //********************************************
    //************* iteration section*************
    if (delta >= 1000) {
      currentEnemies[enemyIndex].animationChain(moveSets);
      enemyIndex++;
      lastTime = currentTime;
    }
    //********************************************
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};
//********************************************************************

//***********************new enemy add to arrays***********************
const enemySpawnPoint = {
  x: 175,
  y: -100,
};
let currentEnemies = [];
let currentEnemyFormations = [];
let sequenceEnded = false;
let isAllDestroyed = false;
let enemySequence = 0;
let timerId; // Variable to store the timer ID

// const sequenceTimeLimits = [18000, 20000, 23000];

const createNewEnemies = (sequence) => {
  // Clear the previous timer if it exists
  const sequenceFinalPath = enemeyPaths[sequence[sequence.length - 1][1]];
  const sequenceTimeLimits = sequenceFinalPath.split(' ').length * 1200 + (sequence.length * 1000);
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    sequenceEnded = true;
  }, sequenceTimeLimits);
  //remove last enemy team
  currentEnemies.splice(0, currentEnemies.length);
  currentEnemyFormations.splice(0, currentEnemyFormations.length);
  isAllDestroyed = false;
  sequenceEnded = false;
  //**********************
  for (let i = 0; i < sequence.length; i++) {
    const enemyType = sequence[i][0];
    const pathIndex = sequence[i][1];
    let health, width, height, bulletAmount, bulletTexture;
    switch (enemyTypes[enemyType]) {
      case 'mini-ship':
        health = 5;
        width = 40;
        height = 40;
        bulletAmount = 5;
        bulletTexture = 'medium-red-bullet.png';
        break;
      case 'mini-drone':
        health = 2;
        width = 20;
        height = 20;
        bulletAmount = 5;
        bulletTexture = 'green-orb.png';
        break;
    }
    const newEnemy = new EnemiesComponent(
      enemySpawnPoint.x,
      enemySpawnPoint.y,
      width,
      height,
      `enemy-${enemyTypes[enemyType]}.png`,
      health,
      bulletAmount,
      bulletTexture
    );
    currentEnemies.push(newEnemy);
    currentEnemyFormations.push(enemeyPaths[pathIndex].split(' '));
  }
  gridTable(...currentEnemyFormations);
  if (enemySequence === enemyTeamsAppearingSequence.length - 1) {
    enemySequence = 0;
  } else {
    enemySequence++;
  }
};
// first start sequence
createNewEnemies(enemyTeamsAppearingSequence[0].split(' '), 0);
//*********************************************************************

//***************Render and check if enemies destroyed****************
const renderEnemies = () => {
  const currentEnemyAmount = currentEnemies.length;
  let destroyedCount = 0;
  let isAllAnimationFinished = 0;
  for (let i = 0; i < currentEnemyAmount; i++) {
    const currentEnemy = currentEnemies[i];
    currentEnemy.bulletUpdate(player);
    if (currentEnemy.animationFinished) {
      isAllAnimationFinished++;
    } else {
      currentEnemy.update();
    }
    if (currentEnemy.destroyed) {
      destroyedCount++;
    } else {
      currentEnemy.damageDetect(player.bullets);
    }
  }
  if (destroyedCount === currentEnemyAmount && isAllAnimationFinished === currentEnemyAmount) {
    isAllDestroyed = true;
  }
  //****spwap defeated or timeouted enemys with new ones****
  if (isAllDestroyed || sequenceEnded) {
    if (timerId) {
      clearTimeout(timerId);
    }
    createNewEnemies(enemyTeamsAppearingSequence[enemySequence].split(' '));
  }
  //********************************************************
};

export const enemiesFunctions = () => {
  renderEnemies();
};
