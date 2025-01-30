const weaponActionFunctions = {
  damageEnemy(enemies, enemy, damage) {
    enemy.health = enemy.health - damage;
    if (enemy.health <= 0) enemies.destroy(enemy);
  },
  homingWeapon(weapon, scene, speed) {
    scene.physics.moveToObject(weapon, scene.player.group, speed);
  },
};

export const weaponsConfig = {
  bullet: {
    name: "bullet",
    texture: "bullet",
    textureType: "image",
    damage: 10,
    speed: 300,
    cooldown: 500,
    colliderActions: [
      {
        targetGroupDefinition: { typeName: "enemies" },
        callback: function (weapon, enemy) {
          const enemies = this.scene.enemies[enemy.name];
          weaponActionFunctions.damageEnemy(enemies, enemy, weapon.damage);
          this.destroy(weapon);
        },
      },
    ],
  },
  axe: {
    name: "axe",
    texture: "axe",
    textureType: "image",
    damage: 50,
    speed: 150,
    displayWidth: 20,
    cooldown: 500,
    colliderActions: [
      {
        targetGroupDefinition: { typeName: "enemies" },
        callback: function (weapon, enemy) {
          const { scene, speed } = this;
          const enemies = this.scene.enemies[enemy.name];
          weaponActionFunctions.damageEnemy(enemies, enemy, weapon.damage);
          weaponActionFunctions.homingWeapon(weapon, scene, speed);
        },
      },
    ],
  },
};
