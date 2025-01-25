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

function addEnemy(physics, enemy, amount) {
  const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
    outerRectangle,
    innerRectangle,
  );
  enemy = physics.add.group({
    key: "bunny",
    repeat: amount - 1,
    setXY: { x: spawnPoint.x, y: spawnPoint.y, stepX: 60 },
  });
  return enemy;
}

function moveEnemiesTowardsPlayer(enemy, physics, player) {
  // move enemies towards player
  enemy.getMatching("visible", true).forEach((enemy) => {
    physics.moveToObject(
      enemy,
      player,
      Phaser.Math.FloatBetween(
        gameOptions.gruntMinSpeed,
        gameOptions.gruntMaxSpeed,
      ),
    );
  });
}

function isEnemyInsideGame(enemy) {
  return Phaser.Geom.Rectangle.Contains(gameRectangle, enemy.x, enemy.y);
}

function createEnemy(enemy, key, amount) {
  let spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
    outerRectangle,
    innerRectangle,
  );
  enemy.createMultiple({
    key: key,
    repeat: amount - 1,
    setXY: { x: spawnPoint.x, y: spawnPoint.y, stepX: 60 },
  });
  spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
    outerRectangle,
    innerRectangle,
  );
}

export { addEnemy, createEnemy, moveEnemiesTowardsPlayer, isEnemyInsideGame };
