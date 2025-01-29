export const playerConfig = {
  texture: "dude",
  speed: "100",
  playerXP: 0,
  colliderActions: [
    {
      targetGroupDefinition: { typeName: "enemies" },
      callback: function () {
        this.scene.scene.restart();
      },
    },
    {
      targetGroupDefinition: { typeName: "xpGroup" },
      callback: function (player, xp) {
        this.scene.xpGroup[xp.name].kill(xp);

        xp.body.checkCollision.none = true;
        this.playerXP = this.playerXP + xp.xpValue;
      },
    },
  ],
};
