function createControlls(input, controlKeys) {
  const keyboard = input.keyboard;
  controlKeys = keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    right: Phaser.Input.Keyboard.KeyCodes.D,
    escape: Phaser.Input.Keyboard.KeyCodes.ESC,
  });
  return controlKeys;
}

function checkControllsPressed(controlKeys, player, scene, movementDirection) {
  if (controlKeys.right.isDown) {
    movementDirection.x++;
    player.anims.play("right", true);
  }
  if (controlKeys.left.isDown) {
    movementDirection.x--;
    player.anims.play("left", true);
  }
  if (controlKeys.up.isDown) {
    movementDirection.y--;
    player.anims.play("turn", true);
  }
  if (controlKeys.down.isDown) {
    movementDirection.y++;
    player.anims.play("turn", true);
  }
  if (controlKeys.escape.isDown) {
    scene.pause();
    scene.launch("PauseMenu");
  }
  return movementDirection;
}

export { createControlls, checkControllsPressed };
