export class Weapon extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, damage) {
        super(scene, x, y, texture);
        this.scene = scene;
        this.damage = damage;

        // Add weapon to the physics system
        scene.physics.world.enable(this);
        scene.add.existing(this);
    }

    fire(x, y, direction) {
        this.setPosition(x, y);
        this.setVelocity(direction.x * 300, direction.y * 300); // Adjust speed
    }
}
