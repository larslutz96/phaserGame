import { isEnemyInsideGame } from "./enemies";
import { weaponsConfig } from "./config/weapons"

// collider actions
const colBulletEnemyAction = (bullet, enemy, enemyGroup, bulletGroup) => {
  bulletGroup.killAndHide(bullet);
  bullet.body.checkCollision.none = true;
  enemyGroup.killAndHide(enemy);
  enemy.body.checkCollision.none = true;
};

const colAxeEnemyAction = (axe, enemy, enemyGroup, player, physics) => {
  physics.moveToObject(axe, player, weaponsConfig.axe.speed);
  enemyGroup.killAndHide(enemy);
  enemy.body.checkCollision.none = true;
};

const colPlayerEnemyAction = (currentWave, scene) => {
  currentWave = 1;
  scene.restart();
};

// timer actions
const timerWeaponsAction = (physics, player, enemyGroup, weapons) => {
  const closestEnemy = physics.closest(
    player,
    enemyGroup.getMatching("visible", true),
  );
  if (closestEnemy != null && isEnemyInsideGame(closestEnemy)) {
    Object.keys(weapons).forEach((weapon) => {
      const sprite = physics.add.sprite(
        player.x,
        player.y,
        weapons[weapon].spriteName,
      );
      weapons[weapon].group.add(sprite);
      if (weapons[weapon].displayWidth) {
        sprite.displayWidth = weapons[weapon].displayWidth;
        sprite.scaleY = sprite.scaleX;
      }

      physics.moveToObject(sprite, closestEnemy, weapons[weapon].speed);
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
