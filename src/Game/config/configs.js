import { weaponsConfig } from "./weapons";
import { colPlayerEnemyAction } from "../player";

export const colliderConfigs = {
  playerEnemyCollider: (args) => ({
    originGroup: args.player,
    targetGroup: args.groups.enemyGroup,
    action: () => colPlayerEnemyAction(args.currentWave, args.scene),
  }),
  bulletEnemyCollider: (args) => ({
    originGroup: args.groups.weapons.bullet.group,
    targetGroup: args.groups.enemyGroup,
    action: (bullet, enemy) =>
      weaponsConfig.bullet.colliderEnemyAction(
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
      weaponsConfig.axe.colliderEnemyAction(
        axe,
        enemy,
        args.groups.enemyGroup,
        args.player,
        args.physics,
      ),
  }),
};
