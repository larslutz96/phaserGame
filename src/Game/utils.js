import { gameOptions } from "./config/gameOptions";

const createTimers = (args) => {
  const { classes, time } = args;
  const timers = Object.keys(classes).flatMap((typeName) =>
    Object.keys(classes[typeName]).map((className) => {
      const classDefinition = classes[typeName][className];
      let action;

      if (typeName === "enemies") {
        action = classDefinition.create;
      } else {
        action = () => classDefinition.fire();
      }

      return {
        delay: classDefinition.config.cooldown,
        loop: true,
        callback: action,
        callbackScope: classDefinition,
      };
    }),
  );

  // Add timers to the Phaser time system
  timers.forEach((timer) => {
    time.addEvent({
      delay: timer.delay,
      loop: timer.loop,
      callback: timer.callback,
      callbackScope: timer.callbackScope, // Ensure "this" refers to the class instance
    });
  });
};

const isInsideWorld = (x, y) => {
  const worldWidth = gameOptions.worldSize.width; // World width (game canvas size)
  const worldHeight = gameOptions.worldSize.height; // World height (game canvas size)

  // Check if (x, y) is within the game world bounds
  return x >= 0 && x <= worldWidth && y >= 0 && y <= worldHeight;
};

export { createTimers, isInsideWorld };
