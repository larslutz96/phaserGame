import { gameOptions } from "../config/gameOptions";
import { isInsideWorld } from "../utils";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, 5, 5, config.texture);
    this.scene = scene;
    this.config = {};

    // Dynamically assign all config from config
    this.config = {};
    Object.entries(config).forEach(([key, value]) => {
      this.config[key] = value;
    });

    // Add enemy group to scene's physics system
    this.group = this.scene.physics.add.group();
  }

  create() {
    const { scene, texture, group, config } = this;
    const camera = scene.cameras.main;

    // Get the visible area of the camera
    const camX = camera.worldView.x;
    const camY = camera.worldView.y;
    const camWidth = camera.width;
    const camHeight = camera.height;

    let spawnX, spawnY;

    // Randomly decide which side to spawn on (top, bottom, left, right)
    const side = Phaser.Math.Between(0, 3);

    switch (side) {
      case 0: // Left
        spawnX = camX - 50;
        spawnY = Phaser.Math.Between(camY, camY + camHeight);
        break;
      case 1: // Right
        spawnX = camX + camWidth + 50;
        spawnY = Phaser.Math.Between(camY, camY + camHeight);
        break;
      case 2: // Top
        spawnX = Phaser.Math.Between(camX, camX + camWidth);
        spawnY = camY - 50;
        break;
      case 3: // Bottom
        spawnX = Phaser.Math.Between(camX, camX + camWidth);
        spawnY = camY + camHeight + 50;
        break;
    }

    // Spawn the enemy at the chosen position
    const enemy = scene.physics.add.sprite(spawnX, spawnY, texture);

    // Dynamically assign all config from this
    Object.assign(enemy, config);

    if (config.displayWidth) {
      enemy.displayWidth = config.displayWidth;
      enemy.scaleY = enemy.scaleX;
    }
    group.add(enemy);
  }

  damageEnemy(targetEnemy, damage, details) {
    if (details?.radius) {
      const radius = details.radius;
      // Get the position of the target enemy (center of the explosion or damage area)
      const { x, y } = targetEnemy;
      const visibleEnemies = this.group.getMatching("visible", true);
      // Loop through all enemies in the group
      visibleEnemies.forEach((enemy) => {
        // Calculate the distance between the target enemy and the other enemies
        const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);

        // If the enemy is within the radius, apply damage
        if (distance <= radius) {
          // Apply damage to the enemy
          enemy.health = enemy.health - damage;
          if (enemy.health <= 0) this.destroy(enemy);

          // Optionally, you can add an effect or animation for the damage
          // For example:
          // const damageEffect = scene.add.sprite(enemy.x, enemy.y, "damageEffect");
          // damageEffect.play("damageAnimation"); // Assuming you have a damage animation
        }
      });
    } else {
      targetEnemy.health = targetEnemy.health - damage;
      if (targetEnemy.health <= 0) this.destroy(targetEnemy);
    }
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

  getClosestTo(target, insideGame = true) {
    const enemies = this.group.getMatching("visible", true);
    let enemiesInWorld = enemies;
    // Filter enemies based on `insideGame` parameter
    if (insideGame) {
      enemiesInWorld = enemies.filter((enemy) => {
        const { x, y } = enemy;
        return isInsideWorld(x, y);
      });
    }

    // Return the closest enemy from the filtered list
    return this.scene.physics.closest(target, enemiesInWorld);
  }

  moveTowards(destination) {
    const { group, scene, speed } = this;
    group.getMatching("visible", true).forEach((child) => {
      scene.physics.moveToObject(child, destination, speed);
    });
  }

  onDeath(x, y) {
    const { scene, config } = this;

    // Create XP drop
    if (!isInsideWorld(x, y, scene)) {
      const gameWidth = gameOptions.gameSize.width;
      const gameHeight = gameOptions.gameSize.height;
      if (x < 0) x = 0 + config.displayWidth;
      else if (x > gameWidth) x = gameWidth - config.displayWidth;
      if (y < 0) y = 0;
      else if (y > gameHeight) y = gameHeight;
    }
    scene.xpGroup.create(x, y, config.xpValue);
  }

  destroy(child) {
    // Drop XP
    this.onDeath(child.x, child.y);
    child.destroy();
  }
}
