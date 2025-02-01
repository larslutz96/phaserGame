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
    damageType: "poison",
    damage: {
      value: 30,
      type: "poison",
      duration: 5000,
    },
    speed: 500,
    displayWidth: 50,
    cooldown: 1000,
    colliderActions: [
      {
        targetGroupDefinition: { typeName: "enemies" },
        callback: function (weapon, enemy) {
          const enemiesDefinition = this.scene.enemies[enemy.name];
          enemiesDefinition.damageEnemy(enemy, weapon.damage);
          this.destroy(weapon, weapon.damage.duration);
        },
      },
    ],
  },
  cake: {
    name: "cake",
    texture: "cake",
    textureType: "image",
    damage: {
      value: 0, // No direct damage, only stun effect
      type: "stun",
      duration: 2000, // 2 seconds stun duration
      radius: 150,
    },
    speed: 400,
    displayWidth: 50,
    cooldown: 1500,
    colliderActions: [
      {
        targetGroupDefinition: { typeName: "enemies" },
        callback: function (weapon, enemy) {
          const enemiesDefinition = this.scene.enemies[enemy.name];
          enemiesDefinition.damageEnemy(enemy, weapon.damage);
          this.destroy(weapon, weapon.damage.duration);
        },
      },
    ],
  },
  mine: {
    name: "mine",
    texture: "bomb",
    textureType: "image",
    damage: {
      value: 100,
      radius: 200,
    },
    speed: 0, // Static mine, no speed
    displayWidth: 20,
    cooldown: 2000,
    colliderActions: [
      {
        targetGroupDefinition: { typeName: "enemies" },
        callback: function (weapon, enemy) {
          const enemies = this.scene.enemies[enemy.name];
          enemies.damageEnemy(enemy, weapon.damage);
          this.destroy(weapon);
        },
      },
    ],
  },
};
