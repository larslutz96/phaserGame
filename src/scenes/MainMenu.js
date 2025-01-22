import { Scene } from "phaser";
import { gameOptions } from "../gameOptions";

export class MainMenu extends Scene {
  constructor() {
    super("MainMenu");
  }

  create() {
    this.add.image(512, 384, "background");
    this.add.image(
      gameOptions.gameSize.width / 2,
      gameOptions.gameSize.height / 2,
      "logo",
    );
    this.add
      .text(
        gameOptions.gameSize.width / 2,
        gameOptions.gameSize.height / 2 + 100,
        "Main Menu",
        {
          fontFamily: gameOptions.fontFamily,
          fontSize: 38,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        },
      )
      .setOrigin(0.5);

    this.input.once("pointerdown", () => {
      this.scene.start("PlayGame");
    });
  }
}
