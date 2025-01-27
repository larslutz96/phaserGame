import { Scene } from "phaser";
import { weaponsConfig } from "../Game/config/weapons"
import { createPlayer, setPlayerVelocity } from "../Game/player";
import { createAnims } from "../Game/animations";
import { createColliders, createTimers } from "../Game/utils";
import { moveEnemiesTowardsPlayer } from "../Game/enemies";
import { createControlls, checkControllsPressed } from "../Game/gameControlls";
import { Weapon } from "../Game/classes/Weapon"

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
    const { physics, time, currentWave, scene } = this;
    // add player, enemies group and bullets group
    const player = (this.player = createPlayer(physics));
    const enemyGroup = (this.enemyGroup = physics.add.group());
    const bulletGroup = physics.add.group();
    const axeGroup = physics.add.group();

    const newsdf = new Weapon(scene.scene, 450, 450, 'bunny', 10);
    newsdf.fire(450, 450, {x:10,y:10})

    const weapons = {
      bullet: {
        group: bulletGroup,
        spriteName: "bullet",
        speed: weaponsConfig.bullet.speed,
      },
      axe: {
        group: axeGroup,
        spriteName: "axe",
        speed: weaponsConfig.axe.speed,
        displayWidth: 50,
      },
    };

    createTimers({ physics, player, enemyGroup, weapons, time });

    createColliders({
      groups: {
        enemyGroup,
        weapons,
      },
      player,
      physics,
      currentWave,
      scene,
    });
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
