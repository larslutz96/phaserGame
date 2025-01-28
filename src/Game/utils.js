import { weaponsConfig } from "./config/weapons";
import { enemiesConfig } from "./config/enemies";
import { playerConfig } from "./player";

const createColliders = (args) => {
  const { physics, player, scene } = args; // Extract `physics` for convenience
  const colliderConfigs = { weapons: weaponsConfig, player: playerConfig };
  Object.keys(colliderConfigs).forEach((typeName) => {
    Object.keys(colliderConfigs[typeName]).forEach((groupName) => {
      const config = colliderConfigs[typeName][groupName].colliderEnemyAction;
      const targetGroupDefinition = config.targetGroupDefinition;
      let originGroup;
      if (typeName === "player") originGroup = player;
      else originGroup = args.groups[typeName][groupName].group;
      const targetGroup =
        args.groups[targetGroupDefinition.typeName][targetGroupDefinition.name]
          .group;

      Object.assign(config.action, {
        originGroup,
        targetGroup,
        physics,
        player,
        scene,
      });

      physics.add.collider(originGroup, targetGroup, config.action);
    });
  });
};

const createTimers = (args) => {
  const { physics, player, groups, time } = args;
  const timerConfigs = { ...weaponsConfig, ...enemiesConfig };

  const timers = Object.keys(timerConfigs).map((key) => {
    const config = timerConfigs[key];
    return {
      delay: config.cooldown,
      loop: true,
      callback: () =>
        config.timerAction({
          physics,
          enemyGroup: groups.enemies.bunny.group,
          player,
          weapons: groups.weapons,
        }),
    };
  });

  // Add timers to the Phaser time system
  timers.forEach((timer) => {
    time.addEvent({
      delay: timer.delay,
      loop: timer.loop,
      callback: timer.callback,
    });
  });
};

export { createColliders, createTimers };
