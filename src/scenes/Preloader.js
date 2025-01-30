import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(512, 384, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    const self = this;

    this.load.json("assetList", "assets.json");

    this.load.on("progress", function (value) {
      console.log("Loading progress:", value);
    });

    this.load.on("complete", function () {
      console.log("complete");
      const assetList = self.cache.json.get("assetList");

      Object.values(assetList).forEach((image) => {
        const { path, type, texture, frameWidth = 32, frameHeight = 48 } = image;
        const name = texture || path.replace(".png","")
        try {
          if (type === "spritesheet") {
            self.load.spritesheet(name, `sprites/${path}`, {
              frameWidth,
              frameHeight,
            });
          } else {
            self.load.image(name, `sprites/${path}`);
          }
        } catch (err) {
          console.error(`Error loading asset for ${name}:`, err);
        }
      });

      self.load.start();
    });
  }

  create() {
    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("MainMenu");
  }
}
