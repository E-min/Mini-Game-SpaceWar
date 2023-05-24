import { GameObjectsComponent } from "./gameObjectsComponent.js"


const enemyDrone = new GameObjectsComponent(20, 20, "enemy-mini-drone.png", 175, 100)
const generateEnemies = () => {
  enemyDrone.update()
  enemyDrone.angle = 270
}

export const enemyFunctions = () => {
    generateEnemies()
}