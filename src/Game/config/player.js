export const playerConfig = {
  name: "player",
  texture: "player",
  textureType: "spritesheet",
  speed: "100",
  health: 1000,
  xp: 0,
  colliderActions: [
    {
      targetGroupDefinition: { typeName: "enemies" },
      callback: function (player, enemy) {
        this.health = this.health - enemy.damage;
        if (this.health <= 0) this.scene.scene.restart();
        this.healthText.setText(`Health: ${this.health}`);
      },
    },
    {
      targetGroupDefinition: { typeName: "xpGroup" },
      callback: function (player, xp) {
        const newXP = player.xp + xp.xpValue;
        player.xp = newXP;
        this.xpText.setText(`XP: ${newXP}`);
        this.scene.xpGroup.destroy(xp);
      },
    },
  ],
};
