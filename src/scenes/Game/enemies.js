import { gameOptions } from "../../gameOptions"; // game options
const gameRectangle = new Phaser.Geom.Rectangle(
  0,
  0,
  gameOptions.gameSize.width,
  gameOptions.gameSize.height,
);
const outerRectangle = new Phaser.Geom.Rectangle(
  -100,
  -100,
  gameOptions.gameSize.width + 200,
  gameOptions.gameSize.height + 200,
);
const innerRectangle = new Phaser.Geom.Rectangle(
  -50,
  -50,
  gameOptions.gameSize.width + 100,
  gameOptions.gameSize.height + 100,
);

function moveEnemiesTowardsPlayer(enemy, physics, player) {
  // move enemies towards player
  enemy.getMatching("visible", true).forEach((enemy) => {
    physics.moveToObject(enemy, player, gameOptions.enemySpeed);
  });
}

function isEnemyInsideGame(enemy) {
  return Phaser.Geom.Rectangle.Contains(gameRectangle, enemy.x, enemy.y);
}

function createEnemy(physics, enemyGroup, key) {
  const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
    outerRectangle,
    innerRectangle,
  );
  const enemy = physics.add.sprite(spawnPoint.x, spawnPoint.y, key);
  enemyGroup.add(enemy);
}

export { createEnemy, moveEnemiesTowardsPlayer, isEnemyInsideGame };
