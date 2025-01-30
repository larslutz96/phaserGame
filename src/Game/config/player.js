export const playerConfig = {
  name: "player",
  texture: "player",
  textureType: "spritesheet",
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
        this.playerXP = this.playerXP + xp.xpValue;
        this.scene.xpGroup.destroy(xp);
      },
    },
  ],
};
