// const weaponActionFunctions = {
//   homingWeapon(weapon, scene, speed) {
//     scene.physics.moveToObject(weapon, scene.player.group, speed);
//   },
// };

export const weaponsConfig = {
  // bullet: {
  //   name: "bullet",
  //   texture: "bullet",
  //   textureType: "image",
  //   damage: 10,
  //   speed: 300,
  //   cooldown: 700,
  //   colliderActions: [
  //     {
  //       targetGroupDefinition: { typeName: "enemies" },
  //       callback: function (weapon, enemy) {
  //         const enemies = this.scene.enemies[enemy.name];
  //         weaponActionFunctions.damageEnemy(enemies, enemy, weapon.damage);
  //         this.destroy(weapon);
  //       },
  //     },
  //   ],
  // },
  // axe: {
  //   name: "axe",
  //   texture: "axe",
  //   textureType: "image",
  //   damage: 50,
  //   speed: 150,
  //   displayWidth: 20,
  //   cooldown: 1000,
  //   colliderActions: [
  //     {
  //       targetGroupDefinition: { typeName: "enemies" },
  //       callback: function (weapon, enemy) {
  //         const { scene, speed } = this;
  //         const enemies = this.scene.enemies[enemy.name];
  //         weaponActionFunctions.damageEnemy(enemies, enemy, weapon.damage);
  //         weaponActionFunctions.homingWeapon(weapon, scene, speed);
  //       },
  //     },
  //   ],
  // },
  fart: {
    name: "fart",
    texture: "fart",
    textureType: "image",
    damage: 50,
    speed: 500,
    displayWidth: 50,
    cooldown: 1000,
    colliderActions: [
      {
        targetGroupDefinition: { typeName: "enemies" },
        callback: function (weapon, enemy) {
          const enemiesDefinition = this.scene.enemies[enemy.name];
          enemiesDefinition.damageEnemy(enemy, weapon.damage);
        },
      },
    ],
  },
  mine: {
    name: "mine",
    texture: "bomb",
    textureType: "image",
    damage: 150,
    speed: 0, // Static mine, no speed
    displayWidth: 20,
    cooldown: 2000,
    radius: 200,
    colliderActions: [
      {
        targetGroupDefinition: { typeName: "enemies" },
        callback: function (weapon, enemy) {
          const enemies = this.scene.enemies[enemy.name];
          // Damage all enemies within a radius
          enemies.damageEnemy(enemy, weapon.damage, { radius: weapon.radius });
          this.destroy(weapon);
        },
      },
    ],
  },
};
