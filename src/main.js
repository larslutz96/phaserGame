import { Boot } from "./scenes/Boot";
import { PlayGame } from "./scenes/Game/PlayGame";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { gameOptions } from "./scenes/Game/gameOptions";
import { PauseMenu } from "./scenes/PauseMenu";

// object to initialize the Scale Manager
const scale = {
  mode: Phaser.Scale.FIT, // adjust size to automatically fit in the window
  autoCenter: Phaser.Scale.CENTER_BOTH, // center the game horizontally and vertically
  parent: "game-container", // DOM id where to render the game
  width: gameOptions.gameSize.width, // game width, in pixels
  height: gameOptions.gameSize.height, // game height, in pixels
};

const config = {
  type: Phaser.WEBGL,
  parent: "game-container",
  backgroundColor: gameOptions.gameBackgroundColor,
  scale: scale,
  physics: {
    default: "arcade",
  },
  scene: [Boot, Preloader, MainMenu, PlayGame, GameOver, PauseMenu],
};

export default new Phaser.Game(config);
