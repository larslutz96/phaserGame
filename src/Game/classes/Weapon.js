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
    const { scene, texture, group, displayWidth, speed } = this;
    const enemieNames = Object.keys(scene.enemies);
    // Function to calculate distance
    const distanceToPlayer = (x1, y1, x2, y2) => {
      var dx = x1 - x2;
      var dy = y1 - y2;
      return Math.sqrt(dx * dx + dy * dy);
    };

    let closestEnemy;
    let closestEnemyChild;
    enemieNames.forEach((name) => {
      const currentEnemyDefintion = scene.enemies[name];
      let closestDistance = 9999;
      const currentClosestEnemyChild = currentEnemyDefintion.getClosestTo(
        scene.player.group,
      );
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
    });

    if (closestEnemy != null) {
      const sprite = scene.physics.add.sprite(
        scene.player.group.x,
        scene.player.group.y,
        texture,
      );
      group.add(sprite);
      if (displayWidth) {
        sprite.displayWidth = displayWidth;
        sprite.scaleY = sprite.scaleX;
      }

      scene.physics.moveToObject(sprite, closestEnemyChild, speed);
    }
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
}
