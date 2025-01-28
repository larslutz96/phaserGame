import { createEnemy } from "../enemies";

export const enemiesConfig = {
  bunny: {
    cooldown: 100,
    timerAction: ({ physics, enemyGroup }) =>
      createEnemy(physics, enemyGroup, "bunny"),
  },
};
