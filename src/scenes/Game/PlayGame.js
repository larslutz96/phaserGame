import { Scene } from "phaser";
import { gameOptions } from "../../gameOptions"; // game options

// PlayGame class extends Phaser.Scene class
export class PlayGame extends Scene {
  constructor() {
    super({
      key: "PlayGame",
    });
  }

  controlKeys; // keys used to move the player
  player; // the player
  enemyGrou; // group with all enemies

  // method to be called once the instance has been created
  create() {
    // add player, enemies group and bullets group
    this.player = this.physics.add.sprite(
      gameOptions.gameSize.width / 2,
      gameOptions.gameSize.height / 2,
      "player",
    );
    this.enemyGroup = this.physics.add.group();
    const bulletGroup = this.physics.add.group();

    // set keyboard controls
    const keyboard = this.input.keyboard;
    this.controlKeys = keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // set outer rectangle and inner rectangle; enemy spawn area is between these rectangles
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

    // timer event to add enemies
    this.time.addEvent({
      delay: gameOptions.enemyRate,
      loop: true,
      callback: () => {
        const spawnPoint = Phaser.Geom.Rectangle.RandomOutside(
          outerRectangle,
          innerRectangle,
        );
        const enemy = this.physics.add.sprite(
          spawnPoint.x,
          spawnPoint.y,
          "enemy",
        );
        this.enemyGroup.add(enemy);
      },
    });

    // timer event to fire bullets
    this.time.addEvent({
      delay: gameOptions.bulletRate,
      loop: true,
      callback: () => {
        const closestEnemy = this.physics.closest(
          this.player,
          this.enemyGroup.getMatching("visible", true),
        );
        if (closestEnemy != null) {
          const bullet = this.physics.add.sprite(
            this.player.x,
            this.player.y,
            "bullet",
          );
          bulletGroup.add(bullet);
          this.physics.moveToObject(
            bullet,
            closestEnemy,
            gameOptions.bulletSpeed,
          );
        }
      },
    });

    // bullet Vs enemy collision
    this.physics.add.collider(bulletGroup, this.enemyGroup, (bullet, enemy) => {
      bulletGroup.killAndHide(bullet);
      bullet.body.checkCollision.none = true;
      this.enemyGroup.killAndHide(enemy);
      enemy.body.checkCollision.none = true;
    });

    // player Vs enemy collision
    this.physics.add.collider(this.player, this.enemyGroup, () => {
      this.scene.restart();
    });
  }

  // metod to be called at each frame
  update() {
    // set movement direction according to keys pressed
    let movementDirection = new Phaser.Math.Vector2(0, 0);
    if (this.controlKeys.right.isDown) {
      movementDirection.x++;
    }
    if (this.controlKeys.left.isDown) {
      movementDirection.x--;
    }
    if (this.controlKeys.up.isDown) {
      movementDirection.y--;
    }
    if (this.controlKeys.down.isDown) {
      movementDirection.y++;
    }

    // set player velocity according to movement direction
    this.player.setVelocity(0, 0);
    if (movementDirection.x == 0 || movementDirection.y == 0) {
      this.player.setVelocity(
        movementDirection.x * gameOptions.playerSpeed,
        movementDirection.y * gameOptions.playerSpeed,
      );
    } else {
      this.player.setVelocity(
        (movementDirection.x * gameOptions.playerSpeed) / Math.sqrt(2),
        (movementDirection.y * gameOptions.playerSpeed) / Math.sqrt(2),
      );
    }

    // move enemies towards player
    this.enemyGroup.getMatching("visible", true).forEach((enemy) => {
      this.physics.moveToObject(enemy, this.player, gameOptions.enemySpeed);
    });
  }
}
