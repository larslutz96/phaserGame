import { isEnemyInsideGame } from "./enemies";
import { gameOptions } from "../../gameOptions"; // game options

// collider actions
const colBulletEnemyAction = (bullet, enemy, bulletGroup, enemyGroup) => {
  bulletGroup.killAndHide(bullet);
  bullet.body.checkCollision.none = true;
  enemyGroup.killAndHide(enemy);
  enemy.body.checkCollision.none = true;
};

const colAxeEnemyAction = (
  axe,
  enemy,
  player,
  gameOptions,
  enemyGroup,
  physics,
) => {
  physics.moveToObject(axe, player, gameOptions.bulletSpeed);
  enemyGroup.killAndHide(enemy);
  enemy.body.checkCollision.none = true;
};

const colPlayerEnemyAction = (scene) => {
  scene.currentWave = 1;
  scene.scene.restart();
};

// timer actions
const timerWeaponsAction = (physics, player, enemyGroup, weaponGroups) => {
  const closestEnemy = physics.closest(
    player,
    enemyGroup.getMatching("visible", true),
  );
  if (closestEnemy != null && isEnemyInsideGame(closestEnemy)) {
    weaponGroups.forEach((weapon) => {
      const sprite = physics.add.sprite(player.x, player.y, weapon.spriteName);
      weapon.group.add(sprite);
      if (weapon.displayWidth) {
        sprite.displayWidth = weapon.displayWidth;
        sprite.scaleY = sprite.scaleX;
      }

      physics.moveToObject(sprite, closestEnemy, weapon.speed);
    });
  }
};

const timerGameDuration = (scene) => {
  scene.start("MainMenu");
};
export {
  colBulletEnemyAction,
  colAxeEnemyAction,
  colPlayerEnemyAction,
  timerWeaponsAction,
  timerGameDuration,
};
