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

export { createTimers };
