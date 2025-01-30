const weaponActionFunctions = {
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
          this.scene.enemies[enemy.texture.key].destroy(enemy);
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
          this.scene.enemies[enemy.texture.key].destroy(enemy);
          weaponActionFunctions.homingWeapon(weapon, scene, speed);
        },
      },
    ],
  },
};
