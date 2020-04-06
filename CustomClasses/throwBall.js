const ballMultiplier = 700;
const ballBounce = 0.9;

class ThrowBall extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, velocity) {
		const a = x ? x : 0;
		const b = y ? y : 0;
		super(scene, a, b, "items", 1);
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

		scene.physics.add.overlap(this, scene.bombs, (ball, bomb) => {
			if (scene.gameState.lives === 0) {
				this.destroy();
				return;
			}
			scene.gameState.score++;
			if (scene.gameState.score % 10 === 0) {
				let heart = new PickUp(scene);
				scene.physics.add.overlap(heart, scene.player, () => {
					scene.gameState.lives++;
					heart.destroy();
				});
			}
			if (scene.gameState.score % 20 === 0) {
				let newBomb = scene.physics.add
					.sprite(16, 16, "items", 3)
					.setScale(2);
				scene.bombs.add(newBomb);
				newBomb.setRandomPosition(
					0,
					0,
					game.config.width,
					game.config.height / 2 - 32
				);
				newBomb.setCircle(8);
				newBomb.setBounce(1);
				newBomb.setCollideWorldBounds(true);
				newBomb.setVelocity(50, 50);
			}

			//Update bomb
			bomb.disableBody();
			bomb.setScale(1);
			bomb.setTexture("explosion");
			bomb.play("explosion", false);
			bomb.once(
				"animationcomplete", //Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE
				() => {
					//scene.bombs.remove(bomb, true, true);
					var timer = scene.time.addEvent({
						delay: 1000,
						callback: () => {
							if (scene.gameState.lives === 0) return;
							bomb.setRandomPosition(
								0,
								0,
								game.config.width,
								game.config.height / 2 - 32
							);
							bomb.setTexture("items", 3);
							bomb.setScale(2);
							bomb.setVisible(true);
							bomb.setVelocity(50, 50);
							bomb.enableBody();
							timer.remove();
						},
						callbackScope: this,
						loop: false,
					});
				}
			);
		});
	}
}
