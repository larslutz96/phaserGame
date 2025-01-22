import { gameOptions } from "../../gameOptions"; // game options

function createEnemy(physics, enemy, amount) {
  enemy = physics.add.group({
    key: "bunny",
    repeat: amount - 1,
    setXY: { x: 60, y: 0, stepX: 60 },
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

export { createEnemy, moveEnemiesTowardsPlayer };
