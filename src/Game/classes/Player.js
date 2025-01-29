import { gameOptions } from "../config/gameOptions";

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, 400, 400, config.texture);
    this.scene = scene;

    // Dynamically assign all properties from config
    Object.entries(config).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  create() {
    const { scene, texture } = this;
    const playerGroup = (this.group = scene.physics.add.sprite(
      gameOptions.gameSize.width / 2,
      gameOptions.gameSize.height / 2,
      texture,
    ));
    playerGroup.setBounce(0.2);
    playerGroup.setCollideWorldBounds(true);
  }

  addColliders() {
    const { scene, group, colliderActions } = this;
    colliderActions.forEach(({ targetGroupDefinition, callback }) => {
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

  setPlayerVelocity(movementDirection) {
    const { group } = this;
    // set player velocity according to movement direction
    group.setVelocity(0, 0);
    if (movementDirection.x == 0 || movementDirection.y == 0) {
      group.setVelocity(
        movementDirection.x * gameOptions.playerSpeed,
        movementDirection.y * gameOptions.playerSpeed,
      );
    } else {
      group.setVelocity(
        (movementDirection.x * gameOptions.playerSpeed) / Math.sqrt(2),
        (movementDirection.y * gameOptions.playerSpeed) / Math.sqrt(2),
      );
    }
  }
}
