import { gameOptions } from "../config/gameOptions";

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, 400, 400, config.texture);
    this.scene = scene;
    this.xpText = scene.add.text(scene.cameras.main.width - 200, 20, `XP: 0`, {
      fontSize: gameOptions.font.fontSize,
      fill: gameOptions.font.fill,
      fontStyle: gameOptions.font.fontStyle,
    });
    this.xpText.setScrollFactor(0); // Makes the text stay fixed on the screen
    this.healthText = scene.add.text(0, 20, `Health: ${config.health}`, {
      fontSize: gameOptions.font.fontSize,
      fill: gameOptions.font.fill,
      fontStyle: gameOptions.font.fontStyle,
    });
    this.healthText.setScrollFactor(0); // Makes the text stay fixed on the screen

    // Dynamically assign all config from config
    this.config = {};
    Object.entries(config).forEach(([key, value]) => {
      this.config[key] = value;
    });
  }

  create() {
    const { scene, texture, config } = this;
    const player = (this.group = scene.physics.add.sprite(
      gameOptions.gameSize.width / 2,
      gameOptions.gameSize.height / 2,
      texture,
    ));
    // Dynamically assign all config from this
    Object.assign(player, config);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    player.setCollideWorldBounds(true);
  }

  addColliders() {
    const { scene, group, config } = this;
    config.colliderActions.forEach(({ targetGroupDefinition, callback }) => {
      // either use a specific group or all of them
      if (targetGroupDefinition.name) {
        const targetGroup =
          scene[targetGroupDefinition.typeName]?.[targetGroupDefinition.name]
            ?.group;
        scene.physics.add.collider(group, targetGroup, callback.bind(this));
      } else {
        if (scene[targetGroupDefinition.typeName].group) {
          scene.physics.add.collider(
            group,
            scene[targetGroupDefinition.typeName].group,
            callback.bind(this),
          );
        } else {
          const targets = scene[targetGroupDefinition.typeName];
          Object.values(targets).forEach((target) => {
            // check if its a class or directly a phyisics group
            scene.physics.add.collider(
              group,
              target.group,
              callback.bind(this),
            );
          });
        }
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
