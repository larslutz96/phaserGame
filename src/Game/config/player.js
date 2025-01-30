export const playerConfig = {
  name: "player",
  texture: "player",
  textureType: "spritesheet",
  speed: "100",
  xp: 0,
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
        const newXP = this.xp + xp.xpValue;
        this.xp = newXP;
        this.xpText.setText(`XP: ${newXP}`);
        this.scene.xpGroup.destroy(xp);
      },
    },
  ],
};
