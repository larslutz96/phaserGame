import { Scene } from "phaser";
import { gameOptions } from "../../gameOptions"; // game options
import { createPlayer, setPlayerVelocity } from "./player";
import { createAnims } from "./animations";
import {
  addEnemy,
  createEnemy,
  moveEnemiesTowardsPlayer,
  isEnemyInsideGame,
} from "./enemies";
import { createControlls, checkControllsPressed } from "./gameControlls";

// PlayGame class extends Phaser.Scene class
export class PlayGame extends Scene {
  controlKeys; // keys used to move the player
  player; // the player
  enemyGrunts; // group with all enemies
  gruntAmount;

  constructor() {
    super({
      key: "PlayGame",
    });
  }

  init() {
    this.gruntAmount = 10;
    this.currentWave = 1;
    this.controlKeys = createControlls(this.input, this.controlKeys);
    if (!this.anims.anims.entries.left) createAnims(this.anims);
  }

  create() {
    // add player, enemies group and bullets group
    this.player = createPlayer(this.player, this.physics);

    //Initial spawn of enemies for wave 1
    this.enemyGrunts = addEnemy(
      this.physics,
      this.enemyGrunts,
      this.gruntAmount,
    );

    const bulletGroup = this.physics.add.group();
    // timer event to fire bullets
    this.time.addEvent({
      delay: gameOptions.bulletRate,
      loop: true,
      callback: () => {
        const closestEnemy = this.physics.closest(
          this.player,
          this.enemyGrunts.getMatching("visible", true),
        );
        if (closestEnemy != null && isEnemyInsideGame(closestEnemy)) {
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
    this.physics.add.collider(
      bulletGroup,
      this.enemyGrunts,
      (bullet, enemy) => {
        bulletGroup.killAndHide(bullet);
        bullet.body.checkCollision.none = true;
        this.enemyGrunts.killAndHide(enemy);
        this.gruntAmount -= 1;
        enemy.body.checkCollision.none = true;
      },
    );
    // player Vs enemy collision
    this.physics.add.collider(this.player, this.enemyGrunts, () => {
      this.gruntAmount = 10;
      this.currentWave = 1;
      this.scene.restart();
    });

    // Game Ends After Duration
    this.time.addEvent({
      delay: gameOptions.gameDuration,
      callback: () => {
        this.scene.start("MainMenu");
      },
    });
  }

  // metod to be called at each frame
  update() {
    if (this.gruntAmount === 0) {
      this.currentWave += 1; //Increment the wave amount to make more baddies spawn
      this.gruntAmount = this.currentWave;
      createEnemy(this.enemyGrunts, "bunny", this.gruntAmount);
    }

    // set movement direction according to keys pressed
    let movementDirection = new Phaser.Math.Vector2(0, 0);
    movementDirection = checkControllsPressed(
      this.controlKeys,
      this.player,
      this.scene,
      movementDirection,
    );

    setPlayerVelocity(this.player, movementDirection);

    moveEnemiesTowardsPlayer(this.enemyGrunts, this.physics, this.player);
  }
}
