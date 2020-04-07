const ballMultiplier = 600;
const ballBounce = 0.9;

class ThrowBall extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, velocity) {
		const a = x ? x : 0;
		const b = y ? y : 0;
		super(scene, a, b, "weapons", 0);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.setScale(2);
		this.body.setCircle(8);
		this.body.setBounce(ballBounce);
		this.body.setCollideWorldBounds(true);

		this.overlapOnce = false;
		scene.physics.add.collider(this, scene.ground);
		if (velocity) {
			velocity = normalise(velocity);
			this.body.setVelocity(
				ballMultiplier * velocity.x,
				ballMultiplier * velocity.y
			);
		}
	}
}
