export const weaponsConfig = {
  bullet: {
    texture: "bullet",
    damage: 10,
    speed: 300,
    cooldown: 500,
    colliderActions: [
      {
        targetGroupDefinition: { name: "bunny", typeName: "enemies" },
        callback: function (bullet, enemy) {
          this.group.killAndHide(bullet);
          bullet.body.checkCollision.none = true;
          this.scene.enemies.bunny.group.killAndHide(enemy);
          enemy.body.checkCollision.none = true;
        },
      },
    ],
  },
  axe: {
    texture: "axe",
    damage: 50,
    speed: 150,
    displayWidth: 20,
    cooldown: 250,
    colliderActions: [
      {
        targetGroupDefinition: { name: "bunny", typeName: "enemies" },
        callback: function (axe, enemy) {
          const scene = this.scene;
          scene.physics.moveToObject(axe, scene.player.group, this.speed);
          scene.enemies.bunny.group.killAndHide(enemy);
          enemy.body.checkCollision.none = true;
        },
      },
    ],
  },
};
