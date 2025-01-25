import { Scene } from "phaser";
import { gameOptions } from "../../gameOptions"; // game options
import { createPlayer, setPlayerVelocity } from "./player";
import { createAnims } from "./animations";
import { addCollider, addTimers } from "./utils";
import * as actions from "./actions";
import { createEnemy, moveEnemiesTowardsPlayer } from "./enemies";
import { createControlls, checkControllsPressed } from "./gameControlls";

// PlayGame class extends Phaser.Scene class
export class PlayGame extends Scene {
  controlKeys; // keys used to move the player
  player; // the player
  enemyGroup; // group with all enemies

  constructor() {
    super({
      key: "PlayGame",
    });
  }

  init() {
    this.currentWave = 1;
    this.controlKeys = createControlls(this.input, this.controlKeys);
    if (!this.anims.anims.entries.left) createAnims(this.anims);
  }

  create() {
    const { physics } = this;
    // add player, enemies group and bullets group
    const player = (this.player = createPlayer(this.player, this.physics));
    const enemyGroup = (this.enemyGroup = this.physics.add.group());
    const bulletGroup = this.physics.add.group();
    const axesGroup = this.physics.add.group();
    const weaponGroups = [
      {
        group: bulletGroup,
        spriteName: "bullet",
        speed: gameOptions.bulletSpeed,
      },
      {
        group: axesGroup,
        spriteName: "axe",
        speed: gameOptions.bulletSpeed,
        displayWidth: 50,
      },
    ];

    addTimers(
      [
        {
          delay: gameOptions.bulletRate,
          loop: true,
          callback: () =>
            actions.timerWeaponsAction(
              physics,
              player,
              enemyGroup,
              weaponGroups,
            ),
        },
        {
          delay: gameOptions.enemyRate,
          loop: true,
          callback: () => createEnemy(this.physics, enemyGroup, "bunny"),
        },
      ],
      this.time,
    );

    addCollider(
      [
        {
          group: player,
          action: () => actions.colPlayerEnemyAction(this),
        },
        {
          group: bulletGroup,
          action: (bullet, enemy) =>
            actions.colBulletEnemyAction(
              bullet,
              enemy,
              bulletGroup,
              enemyGroup,
            ),
        },
        {
          group: axesGroup,
          action: (axe, enemy) =>
            actions.colAxeEnemyAction(
              axe,
              enemy,
              player,
              gameOptions,
              enemyGroup,
              physics,
            ),
        },
      ],
      enemyGroup,
      physics,
    );
  }

  // metod to be called at each frame
  update() {
    const { player, enemyGroup, controlKeys, scene, physics } = this;

    // set movement direction according to keys pressed
    let movementDirection = new Phaser.Math.Vector2(0, 0);
    movementDirection = checkControllsPressed(
      controlKeys,
      player,
      scene,
      movementDirection,
    );

    setPlayerVelocity(player, movementDirection);

    moveEnemiesTowardsPlayer(enemyGroup, physics, player);
  }
}
