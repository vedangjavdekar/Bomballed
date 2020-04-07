const BOOMERANG = {
	speed: 900,
	accs: 1000,
	angular: 1600,
	deadOnSides: false,
	minPower: 0.6,
	maxPower: 1,
};

class Boomerang extends Phaser.Physics.Arcade.Sprite {
	constructor(scene, x, y, velocity, multiplier) {
		super(scene, x, y, "weapons", 1);
		this.setScale(2);
		this.setOrigin(0.5);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.body.setCircle(8);
		this.body.setAllowGravity(false);
		this.body.setCollideWorldBounds(true);
		velocity = normalise(velocity);

		if (multiplier < BOOMERANG.minPower) {
			multiplier = BOOMERANG.minPower;
		} else if (multiplier > BOOMERANG.maxPower) {
			multiplier = BOOMERANG.maxPower;
		}

		this.body.setVelocity(
			multiplier * BOOMERANG.speed * velocity.x,
			multiplier * BOOMERANG.speed * velocity.y
		);
		this.body.setAngularVelocity(BOOMERANG.angular);
		this.body.setAcceleration(
			-BOOMERANG.accs * velocity.x,
			-BOOMERANG.accs * velocity.y
		);
		this.body.onWorldBounds = true;

		if (BOOMERANG.deadOnSides) {
			scene.physics.world.on(
				"worldbounds",
				(body) => {
					this.colliderObj.active = false;
					body.stop();
					body.setAllowGravity(true);
				},
				this
			);
		} else {
			this.body.setBounce(0.4);
			scene.physics.world.on(
				"worldbounds",
				(body) => {
					body.setAccelerationX(body.acceleration.x / 2);
				},
				this
			);
		}

		scene.physics.add.collider(this, scene.ground, (ball, ground) => {
			ball.body.stop();
			ball.angle = 0;
			this.colliderObj.active = false;
			this.onWorldBounds = false;
		});
	}
}
