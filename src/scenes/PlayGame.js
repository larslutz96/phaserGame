import { Scene } from "phaser";
import { weaponsConfig } from "../Game/config/weapons";
import { playerConfig } from "../Game/config/player";
import { createAnims } from "../Game/animations";
import { createTimers } from "../Game/utils";
import { createControlls, checkControllsPressed } from "../Game/gameControlls";
import { Weapon } from "../Game/classes/Weapon";
import { enemiesConfig } from "../Game/config/enemies";
import { xpsConfig } from "../Game/config/xps";
import { Enemy } from "../Game/classes/Enemy";
import { Player } from "../Game/classes/Player";
import { XP } from "../Game/classes/XP";
import { gameOptions } from "../Game/config/gameOptions";

// PlayGame class extends Phaser.Scene class
export class PlayGame extends Scene {
  controlKeys;

  constructor() {
    super({
      key: "PlayGame",
    });
  }

  create() {
    const { time, scene, physics } = this;
    physics.world.setBounds(
      0,
      0,
      gameOptions.worldSize.width,
      gameOptions.worldSize.height,
    );

    // create player
    const player = (this.player = new Player(scene.scene, playerConfig));
    player.create();

    // Setup camera to follow the player
    this.cameras.main.setBounds(
      0,
      0,
      gameOptions.worldSize.width,
      gameOptions.worldSize.height,
    );
    this.cameras.main.startFollow(player.group, true, 0.1, 0.1);

    // create xp
    this.xpGroup = new XP(scene.scene, xpsConfig);

    // create enemies
    const enemies = (this.enemies = {});
    Object.entries(enemiesConfig).forEach(([enemyName, enemyConfig]) => {
      // Create a new weapon for each config
      enemies[enemyName] = new Enemy(scene.scene, enemyConfig);
    });

    // create weapons
    const weapons = (this.weapons = {});
    Object.entries(weaponsConfig).forEach(([weaponName, weaponConfig]) => {
      // Create a new weapon for each config
      weapons[weaponName] = new Weapon(scene.scene, weaponConfig);
    });

    createTimers({
      classes: {
        enemies,
        weapons,
      },
      time,
    });

    // add weapon colliders
    Object.keys(weapons).forEach((weaponName) => {
      weapons[weaponName].addColliders();
    });

    // add player colliders
    player.addColliders();

    this.controlKeys = createControlls(this.input);

    // create animations
    if (!this.anims.anims.entries.left)
      createAnims(this.anims, this.player.config.texture);
  }

  // method to be called at each frame
  update() {
    const { player, enemies, scene, xpGroup } = this;

    // set movement direction according to keys pressed
    let movementDirection = new Phaser.Math.Vector2(0, 0);
    movementDirection = checkControllsPressed(
      scene,
      player.group,
      this.controlKeys,
      movementDirection,
    );

    player.setPlayerVelocity(movementDirection);

    Object.keys(enemies).forEach((enemyName) => {
      // move all enemies towards player
      enemies[enemyName].moveTowards(player.group);
    });

    xpGroup.combineXP();
  }
}
