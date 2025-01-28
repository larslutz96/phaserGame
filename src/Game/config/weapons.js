import { timerWeaponsAction } from "../actions";

export const weaponsConfig = {
  bullet: {
    damage: 10,
    speed: 300,
    cooldown: 500,
    colliderEnemyAction: {
      targetGroupDefinition: { name: "bunny", typeName: "enemies" },
      action: function (bullet, enemy) {
        this.originGroup.killAndHide(bullet);
        bullet.body.checkCollision.none = true;
        this.targetGroup.killAndHide(enemy);
        enemy.body.checkCollision.none = true;
      },
    },
    timerAction: ({ physics, player, enemyGroup, weapons }) =>
      timerWeaponsAction(physics, player, enemyGroup, weapons),
  },
  axe: {
    damage: 50,
    speed: 150,
    cooldown: 1000,
    colliderEnemyAction: {
      targetGroupDefinition: { name: "bunny", typeName: "enemies" },
      action: function (axe, enemy) {
        this.physics.moveToObject(axe, this.player, weaponsConfig.axe.speed);
        this.targetGroup.killAndHide(enemy);
        enemy.body.checkCollision.none = true;
      },
    },
    timerAction: ({ physics, enemyGroup, player, weapons }) =>
      timerWeaponsAction(physics, player, enemyGroup, weapons),
  },
};
