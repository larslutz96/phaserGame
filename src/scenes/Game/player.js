import { gameOptions } from "../../gameOptions"; // game options

function createPlayer(player, physics) {
  player = physics.add.sprite(
    gameOptions.gameSize.width / 2,
    gameOptions.gameSize.height / 2,
    "dude",
  );
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  return player;
}

function setPlayerVelocity (player, movementDirection) {
  // set player velocity according to movement direction
  player.setVelocity(0, 0);
  if (movementDirection.x == 0 || movementDirection.y == 0) {
    player.setVelocity(
      movementDirection.x * gameOptions.playerSpeed,
      movementDirection.y * gameOptions.playerSpeed,
    );
  } else {
    player.setVelocity(
      (movementDirection.x * gameOptions.playerSpeed) / Math.sqrt(2),
      (movementDirection.y * gameOptions.playerSpeed) / Math.sqrt(2),
    );
  }
}

export { createPlayer, setPlayerVelocity };
