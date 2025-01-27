import { Scene } from "phaser";
import { gameOptions } from "./Game/gameOptions";

export class GameOver extends Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    this.cameras.main.setBackgroundColor(0xff0000);

    this.add
      .image(
        gameOptions.gameSize.width / 2,
        gameOptions.gameSize.height / 2,
        "background",
      )
      .setAlpha(0.5);

    this.add
      .text(512, 384, "Game Over", {
        fontFamily: gameOptions.fontFamily,
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("MainMenu");
    });
  }
}
