export class XP extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, 5, 5, config.texture);
    this.scene = scene;

    // Dynamically assign all properties from config
    Object.entries(config).forEach(([key, value]) => {
      this[key] = value;
    });

    // Add enemy group to scene's physics system
    this.group = this.scene.physics.add.group();
  }

  create(x, y) {
    const { scene, texture, group, displayWidth, name } = this;
    const xp = scene.physics.add.sprite(x, y, texture);
    xp.name = name;
    if (displayWidth) {
      xp.displayWidth = displayWidth;
      xp.scaleY = xp.scaleX;
    }
    group.add(xp);

    // Make XP float slightly upwards when dropped
    scene.tweens.add({
      targets: xp,
      y: y - 10,
      duration: 300,
      yoyo: true,
      ease: "Power1",
    });
  }

  kill(child) {
    const { group } = this;
    group.killAndHide(child);
    child.body.checkCollision.none = true;
  }
}
