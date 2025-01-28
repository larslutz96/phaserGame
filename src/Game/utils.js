import { colliderConfigs } from "./config/configs";
import { weaponsConfig } from "./config/weapons";
import { enemiesConfig } from "./config/enemies";

const createColliders = (args) => {
  const { physics } = args; // Extract `physics` for convenience
  Object.keys(colliderConfigs).forEach((key) => {
    const config = colliderConfigs[key](args);
    physics.add.collider(config.originGroup, config.targetGroup, config.action);
  });
};

const createTimers = (scene) => {
  const { physics, player, enemyGroup, weapons, time } = scene;
  const timerConfigs = { ...weaponsConfig, ...enemiesConfig };

  const timers = Object.keys(timerConfigs).map((key) => {
    const config = timerConfigs[key];
    return {
      delay: config.cooldown,
      loop: true,
      callback: () =>
        config.timerAction({
          physics,
          enemyGroup,
          player,
          weapons,
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
