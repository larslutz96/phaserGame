this.samu = this.sound.add("samu");
const button = this.add
  .image(200, 200, "enemy", 1)
  .setInteractive()
  .on("pointerdown", () => this.samu.play({ volume: 0.02 }));
button.name = "foo";
button.setScale(2, 1.5);
