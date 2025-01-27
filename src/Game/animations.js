function createAnims(anims) {
  anims.create({
    key: "left",
    frames: anims.generateFrameNumbers("dude", { start: 0, end: 2 }),
    frameRate: 10,
    repeat: 0,
  });
  anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });
  anims.create({
    key: "right",
    frames: anims.generateFrameNumbers("dude", { start: 5, end: 7 }),
    frameRate: 10,
    repeat: 0,
  });
}

export { createAnims };
