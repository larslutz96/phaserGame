function createAnims(anims, texture) {
  anims.create({
    key: "left",
    frames: anims.generateFrameNumbers(texture, { start: 0, end: 2 }),
    frameRate: 10,
    repeat: 0,
  });
  anims.create({
    key: "turn",
    frames: [{ key: "player", frame: 4 }],
    frameRate: 20,
  });
  anims.create({
    key: "right",
    frames: anims.generateFrameNumbers(texture, { start: 5, end: 7 }),
    frameRate: 10,
    repeat: 0,
  });
}

export { createAnims };
