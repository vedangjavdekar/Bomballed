const PICK_UP_LIFETIME = 10000;

class PickUp extends Phaser.GameObjects.Sprite {
	constructor(scene) {
		super(scene, game.config.width / 2, game.config.height / 2, "items", 5);
		this.setScale(1.5).setOrigin(0.5, 1);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.body.setSize(16, 32);
		this.body.setOffset(0, 4);
		this.setRandomPosition(0, 0, game.config.width, game.config.height / 2);
		scene.physics.add.collider(scene.ground, this);
		scene.tweens.add({
			targets: this,
			alpha: { from: 1, to: 0.4 },
			repeat: 0,
			duration: PICK_UP_LIFETIME,
			ease: "linear",
			onComplete: () => {
				this.destroy();
			},
		});
	}
}
