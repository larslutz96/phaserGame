export const playerConfig = {
  texture: "dude",
  speed: "100",
  colliderActions: [
    {
      targetGroupDefinition: { name: "bunny", typeName: "enemies" },
      callback: function () {
        this.scene.scene.restart();
      },
    },
  ],
};
