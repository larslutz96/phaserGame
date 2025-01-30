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

  create(x, y, xpValue) {
    const { scene, texture, group, displayWidth, name } = this;
    const xp = scene.physics.add.sprite(x, y, texture);
    xp.name = name;
    xp.xpValue = xpValue;
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
      visibleChildren.forEach((child) => {
        xpValue += child.xpValue;
        this.destroy(child);
      });
      // Create a new sprite to combine all children into
      this.create(visibleChildren[0].x, visibleChildren[0].y, xpValue);
    }
  }
}
