/* eslint-disable no-undef */
import { Scene } from "phaser";
import { gameOptions } from "../../gameOptions"; // game options
import { createPlayer, setPlayerVelocity } from "./player";
import { createAnims } from "./animations";
import { createEnemy, moveEnemiesTowardsPlayer } from "./enemies";
import { createControlls, checkControllsPressed } from "./gameControlls";

// PlayGame class extends Phaser.Scene class
export class PlayGame extends Scene {
  constructor() {
    super({
      key: "PlayGame",
    });
  }

  controlKeys; // keys used to move the player
  player; // the player
  enemyGrunts; // group with all enemies
  gruntAmount = 10;
  currentWave = 1;
  maxWave = 5;
  gameOver = false;

  create() {
    this.controlKeys = createControlls(this.input, this.controlKeys);

    // add player, enemies group and bullets group
    this.player = createPlayer(this.player, this.physics);

    if (!this.anims.anims.entries.left) createAnims(this.anims);

    //Initial spawn of enemies for wave 1
    this.enemyGrunts = createEnemy(
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
  }

  // metod to be called at each frame
  update() {
    if (this.gruntAmount === 0) {
      if (this.currentWave === this.maxWave) {
        //If we're on wave 3 (max) and gruntAmount is zero, that means the player has defeated all waves
        //this.victoryText.visible = true;
        this.gameOver = true;
        this.scene.start("MainMenu");
      } else {
        this.currentWave += 1; //Increment the wave amount to make more baddies spawn
        this.gruntAmount = this.currentWave * 10;
        this.enemyGrunts.createMultiple({
          key: "bunny",
          repeat: this.gruntAmount - 1,
          setXY: { x: 0, y: 0, stepX: 15 },
        });
        this.enemyGrunts.children.iterate(function (child) {
          child.setVelocity(
            0,
            Phaser.Math.FloatBetween(
              gameOptions.gruntMinSpeed,
              gameOptions.gruntMaxSpeed,
            ),
          );
        });
      }
    }

    // set movement direction according to keys pressed
    let movementDirection = new Phaser.Math.Vector2(0, 0);
    movementDirection = checkControllsPressed(
      this.controlKeys,
      this.player,
      this.scene,
      movementDirection,
    );

    setPlayerVelocity(this.player,movementDirection)

    moveEnemiesTowardsPlayer(this.enemyGrunts, this.physics, this.player);
  }
}
