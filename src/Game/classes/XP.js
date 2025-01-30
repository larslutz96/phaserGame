export class XP extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, 5, 5, config.texture);
    this.scene = scene;

    // Dynamically assign all config from config
    this.config = {};
    Object.entries(config).forEach(([key, value]) => {
      this.config[key] = value;
    });

    // Add enemy group to scene's physics system
    this.group = this.scene.physics.add.group();
  }

  create(x, y, xpValue) {
    const { scene, group, config } = this;
    const xp = scene.physics.add.sprite(x, y, config.texture);
    xp.xpValue = xpValue;

    // Dynamically assign all config from this
    Object.assign(xp, config);

    if (config.displayWidth) {
      xp.displayWidth = config.displayWidth;
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

  destroy(child) {
    child.destroy(child);
  }

  // New method to combine all children of the XP group into one
  combineXP() {
    const { group } = this;

    // Iterate over all children in the group
    const visibleChildren = group.getMatching("visible", true);
    if (visibleChildren.length >= 10) {
      let xpValue = 0;
      visibleChildren.slice(1).forEach((child) => {
        xpValue = xpValue + child.xpValue;
        this.destroy(child);
      });
      visibleChildren[0].xpValue = xpValue;
    }
  }
}
