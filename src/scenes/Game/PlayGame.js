import { Scene } from "phaser";
import { gameOptions } from "./gameOptions"; // game options
import { createPlayer, setPlayerVelocity } from "./player";
import { createAnims } from "./animations";
import { createColliders, createTimers } from "./utils";
import { moveEnemiesTowardsPlayer } from "./enemies";
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
    const { physics, time } = this;
    // add player, enemies group and bullets group
    const player = (this.player = createPlayer(this.player, this.physics));
    const enemyGroup = (this.enemyGroup = this.physics.add.group());
    const bulletGroup = this.physics.add.group();
    const axeGroup = this.physics.add.group();
    const weapons = {
      bullet: {
        group: bulletGroup,
        spriteName: "bullet",
        speed: gameOptions.weapons.bulletSpeed,
      },
      axe: {
        group: axeGroup,
        spriteName: "axe",
        speed: gameOptions.weapons.axeSpeed,
        displayWidth: 50,
      },
    };

    createTimers(
      { physics, player, enemyGroup, weapons, time }
    );

    createColliders(
      {
        player,
        enemyGroup,
        physics,
        groups: {
          enemyGroup,
          weapons
        },        
        currentWave: this.currentWave,
        scene: this.scene
      }
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
