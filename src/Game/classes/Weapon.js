export class Weapon extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, config) {
    super(scene, scene.player.group.x, scene.player.group.y, config.texture);
    this.scene = scene;

    // Dynamically assign all properties from config
    Object.entries(config).forEach(([key, value]) => {
      this[key] = value;
    });

    const { physics } = scene;
    this.group = physics.add.group();
  }

  fire() {
    const { scene, texture, group, displayWidth, speed, name } = this;
    const enemieNames = Object.keys(scene.enemies);
    // Function to calculate distance
    const distanceToPlayer = (x1, y1, x2, y2) => {
      var dx = x1 - x2;
      var dy = y1 - y2;
      return Math.sqrt(dx * dx + dy * dy);
    };

    let closestEnemy;
    let closestEnemyChild;
    let closestDistance = 9999;
    enemieNames.forEach((name) => {
      const currentEnemyDefintion = scene.enemies[name];
      const currentClosestEnemyChild = currentEnemyDefintion.getClosestTo(
        scene.player.group,
      );
      if (currentClosestEnemyChild) {
        const curDistance = distanceToPlayer(
          currentClosestEnemyChild.x,
          currentClosestEnemyChild.y,
          scene.player.group.x,
          scene.player.group.y,
        );
        if (closestDistance > curDistance) {
          closestDistance = curDistance;
          closestEnemyChild = currentClosestEnemyChild;
          closestEnemy = currentEnemyDefintion.group;
        }
      }
    });

    if (closestEnemy != null) {
      const weapon = scene.physics.add.sprite(
        scene.player.group.x,
        scene.player.group.y,
        texture,
      );
      weapon.name = name;
      group.add(weapon);
      if (displayWidth) {
        weapon.displayWidth = displayWidth;
        weapon.scaleY = weapon.scaleX;
      }

      scene.physics.moveToObject(weapon, closestEnemyChild, speed);
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

  kill(child) {
    const { group } = this;
    group.killAndHide(child);
    child.body.checkCollision.none = true;
  }
}
