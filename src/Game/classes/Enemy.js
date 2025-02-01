import { gameOptions } from "../config/gameOptions";
import { isInsideWorld } from "../utils";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, 5, 5, config.texture);
    this.scene = scene;
    this.config = {};
    this.events = new Phaser.Events.EventEmitter();

    // Dynamically assign all config from config
    this.config = {};
    Object.entries(config).forEach(([key, value]) => {
      this.config[key] = value;
    });

    // Add enemy group to scene's physics system
    const immovable = config.immovable || true;
    this.group = this.scene.physics.add.group({ immovable });
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

  getEnemiesInRadius(targetEnemy, radius) {
    // Get the position of the target enemy (center of the explosion or damage area)
    const { x, y } = targetEnemy;
    const visibleEnemies = this.group.getMatching("visible", true);
    // Loop through all enemies in the group
    const filteredEnemies = visibleEnemies.filter((enemy) => {
      const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      return distance <= radius;
    });
    return filteredEnemies;
  }

  damageEnemy(targetEnemy, damage) {
    let enemies = [targetEnemy];
    if (damage?.radius) {
      enemies = this.getEnemiesInRadius(targetEnemy, damage.radius);
    }
    enemies.forEach((enemy) => {
      this.reduceHealth(enemy, damage);
      if (enemy.health <= 0) this.destroy(enemy);
    });
  }

  stun(enemy, duration) {
    enemy.setVelocity(0, 0); // Stop movement
    enemy.stunned = true;
    this.scene.time.delayedCall(duration, () => {
      enemy.stunned = false;
    });
  }

  reduceHealth(enemy, damage) {
    switch (damage.type) {
      case "poison": {
        if (enemy.isPoisoned) return; // Prevents multiple poison effects
        enemy.health -= damage.value;
        if (enemy.health <= 0) {
          this.destroy(enemy);
          return;
        }
        enemy.isPoisoned = true;
        enemy.setTint(0x00ff00);
        let tickInterval = 500; // Apply damage every second
        const poison = this.scene.time.addEvent({
          delay: tickInterval, // Run every second
          repeat: Math.floor(damage.duration / tickInterval) - 1, // Repeat for the duration
          callback: () => {
            enemy.health -= damage.value;
            if (enemy.health <= 0) {
              poison.remove();
              this.destroy(enemy);
            }
          },
        });
        break;
      }
      case "stun":
        {
          this.stun(enemy, damage.duration);
        }
        break;
      default:
        enemy.health -= damage.value;
        if (enemy.health <= 0) {
          this.destroy(enemy);
        }
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
    const { group, scene, config } = this;
    group.getMatching("visible", true).forEach((child) => {
      if (!child.stunned) {
        scene.physics.moveToObject(child, destination, config.speed);
      }
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

  destroy(child, delay = 0) {
    if (child.body) child.body.checkCollision.none = true;
    this.scene.time.delayedCall(delay, () => {
      this.onDeath(child.x, child.y);
      child.destroy();
    });
  }
}
