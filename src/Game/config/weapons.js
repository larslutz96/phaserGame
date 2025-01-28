import { timerWeaponsAction } from "../actions";

export const weaponsConfig = {
  bullet: {
    damage: 10,
    speed: 300,
    cooldown: 500,
    colliderEnemyAction: (bullet, enemy, enemyGroup, bulletGroup) => {
      bulletGroup.killAndHide(bullet);
      bullet.body.checkCollision.none = true;
      enemyGroup.killAndHide(enemy);
      enemy.body.checkCollision.none = true;
    },
    timerAction: ({ physics, player, enemyGroup, weapons }) =>
      timerWeaponsAction(physics, player, enemyGroup, weapons),
  },
  axe: {
    damage: 50,
    speed: 150,
    cooldown: 1000,
    colliderEnemyAction: (axe, enemy, enemyGroup, player, physics) => {
      physics.moveToObject(axe, player, weaponsConfig.axe.speed);
      enemyGroup.killAndHide(enemy);
      enemy.body.checkCollision.none = true;
    },
    timerAction: ({ physics, enemyGroup, player, weapons }) =>
      timerWeaponsAction(physics, player, enemyGroup, weapons),
  },
};
