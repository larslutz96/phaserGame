export const playerConfig = {
  texture: "dude",
  speed: "100",
  colliderActions: [
    {
      targetGroupDefinition: { typeName: "enemies" },
      callback: function () {
        this.scene.scene.restart();
      },
    },
  ],
};
