import { isEnemyInsideGame } from "./enemies";

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
export { timerWeaponsAction, timerGameDuration };
