const BOOMERANG = {
	speed: 900,
	accs: 800,
	angular: 1200,
};

class Boomerang extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, velocity) {
		super(scene, x, y, "weapons", 1);
		this.setScale(2);
		this.setOrigin(0.5);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.body.setCircle(8);
		this.body.setAllowGravity(false);
		this.body.setBounce(-1);
		this.body.setCollideWorldBounds(true);
		velocity = normalise(velocity);
		this.body.setVelocity(
			BOOMERANG.speed * velocity.x,
			BOOMERANG.speed * velocity.y
		);
		this.body.setAngularVelocity(BOOMERANG.angular);
		this.body.setAcceleration(
			-BOOMERANG.accs * velocity.x,
			-BOOMERANG.accs * velocity.y
		);

		scene.physics.add.collider(this, scene.ground, (ball, ground) => {
			ball.body.stop();
			ball.angle = 0;
			scene.physics.world.removeCollider(this.colliderObj);
		});
	}
}
