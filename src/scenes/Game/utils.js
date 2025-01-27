import { timerConfigs, colliderConfigs } from "./configs";

const createColliders = (args) => {
  const { physics } = args; // Extract `physics` for convenience
  Object.keys(colliderConfigs).forEach((key) => {
    const config = colliderConfigs[key](args);
    physics.add.collider(config.originGroup, config.targetGroup, config.action);
  });
};

const createTimers = (scene) => {
  const { physics, player, enemyGroup, weapons, time } = scene;

  const timers = Object.keys(timerConfigs).map((key) => {
    const config = timerConfigs[key];
    return {
      delay: config.delay,
      loop: config.loop,
      callback: () =>
        config.callback({
          physics,
          player,
          enemyGroup,
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
