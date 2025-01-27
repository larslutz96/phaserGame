import { createEnemy } from "./enemies";
import * as actions from "./actions";
import { gameOptions } from "./gameOptions";

export const timerConfigs = {
  axeTimer: {
    delay: gameOptions.weapons.axeRate,
    loop: true,
    callback: ({ physics, player, enemyGroup, weapons }) =>
      actions.timerWeaponsAction(physics, player, enemyGroup, weapons),
  },
  bulletTimer: {
    delay: gameOptions.weapons.bulletRate,
    loop: true,
    callback: ({ physics, player, enemyGroup, weapons }) =>
      actions.timerWeaponsAction(physics, player, enemyGroup, weapons),
  },
  bunnyTimer: {
    delay: gameOptions.enemies.bunnyRate,
    loop: true,
    callback: ({ physics, enemyGroup }) =>
      createEnemy(physics, enemyGroup, "bunny"),
  },
};

export const colliderConfigs = {
  playerEnemyCollider: (args) => ({
    originGroup: args.player,
    targetGroup: args.groups.enemyGroup,
    action: () => actions.colPlayerEnemyAction(args.currentWave, args.scene),
  }),
  bulletEnemyCollider: (args) => ({
    originGroup: args.groups.weapons.bullet.group,
    targetGroup: args.groups.enemyGroup,
    action: (bullet, enemy) =>
      actions.colBulletEnemyAction(
        bullet,
        enemy,
        args.groups.enemyGroup,
        args.groups.weapons.bullet.group,
      ),
  }),
  axeEnemyCollider: (args) => ({
    originGroup: args.groups.weapons.axe.group,
    targetGroup: args.groups.enemyGroup,
    action: (axe, enemy) =>
      actions.colAxeEnemyAction(
        axe,
        enemy,
        args.groups.enemyGroup,
        args.player,
        args.physics,
      ),
  }),
};
