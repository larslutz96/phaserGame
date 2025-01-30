import { gameOptions } from "../config/gameOptions"; // game options
const gameRectangle = new Phaser.Geom.Rectangle(
  0,
  0,
  gameOptions.gameSize.width,
  gameOptions.gameSize.height,
);
const outerRectangle = new Phaser.Geom.Rectangle(
  -100,
  -100,
  gameOptions.gameSize.width + 200,
  gameOptions.gameSize.height + 200,
);
const innerRectangle = new Phaser.Geom.Rectangle(
  -50,
  -50,
  gameOptions.gameSize.width + 100,
  gameOptions.gameSize.height + 100,
);

export class Enemy extends Phaser.Physics.Arcade.Sprite {
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

  create() {
    const { scene, texture, group, displayWidth, name } = this;
    const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
      outerRectangle,
      innerRectangle,
    );
    const enemy = scene.physics.add.sprite(spawnPoint.x, spawnPoint.y, texture);
    enemy.name = name;
    if (displayWidth) {
      enemy.displayWidth = displayWidth;
      enemy.scaleY = enemy.scaleX;
    }
    group.add(enemy);
  }

  addColliders() {
    const { scene, group } = this;
    const colliderActions = this.colliderActions;
    colliderActions.forEach(({ targetGroupDefinition, callback }) => {
      // either use a specific group or all of them
      if (targetGroupDefinition.name) {
        const targetGroup =
          scene[targetGroupDefinition.typeName]?.[targetGroupDefinition.name]
            ?.group;
        scene.physics.add.collider(group, targetGroup, callback.bind(this));
      } else {
        const targets = scene[targetGroupDefinition.typeName];
        Object.values(targets).forEach((classDefinition) => {
          scene.physics.add.collider(
            group,
            classDefinition.group,
            callback.bind(this),
          );
        });
      }
    });
  }

  getClosestTo(target) {
    return this.scene.physics.closest(
      target,
      this.group.getMatching("visible", true),
    );
  }

  isInsideGame(child) {
    return Phaser.Geom.Rectangle.Contains(gameRectangle, child.x, child.y);
  }

  moveTowards(destination) {
    const { group, scene, speed } = this;
    group.getMatching("visible", true).forEach((child) => {
      scene.physics.moveToObject(child, destination, speed);
    });
  }

  onDeath(x, y) {
    const { scene, xpValue } = this;

    // Create XP drop
    scene.xpGroup.create(x, y, xpValue);
  }

  destroy(child) {
    // Drop XP
    this.onDeath(child.x, child.y);
    child.destroy();
  }
}
