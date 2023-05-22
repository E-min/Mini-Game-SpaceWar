import { gameArea } from "./modules/gameArea.js";
import { preloadTextures } from "./modules/preLoadTextures.js";

// load textures before starting game
preloadTextures(() => gameArea.start());
