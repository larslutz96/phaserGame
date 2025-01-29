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
    const { scene, texture, group } = this;
    const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
      outerRectangle,
      innerRectangle,
    );
    const enemy = scene.physics.add.sprite(spawnPoint.x, spawnPoint.y, texture);
    group.add(enemy);
  }

  addColliders() {
    const colliderActions = this.colliderActions;
    colliderActions.forEach(({ targetGroupDefinition, callback }) => {
      let targetGroup;
      if (targetGroupDefinition.typeName) {
        targetGroup =
          this.scene[targetGroupDefinition.typeName]?.[
            targetGroupDefinition.name
          ]?.group;
      } else targetGroup = this.scene[targetGroupDefinition.name];

      if (targetGroup) {
        this.scene.physics.add.collider(
          this.group,
          targetGroup,
          callback.bind(this),
        );
      } else {
        console.warn(
          `Collider target group not found: ${targetGroupDefinition.name}`,
        );
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
}
