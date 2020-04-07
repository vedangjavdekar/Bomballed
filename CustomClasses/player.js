const PLAYER = {
	speed: 250,
	air_speed: 150,
	neg_air_speed: 80,
	jump_force: 380,
	dash_speed: 600,
};

class Player extends Phaser.GameObjects.Group {
	constructor(scene) {
		super(scene);
		this.player = this.create(0, 0, "player")
			.setScale(4)
			.play("player_idle");

		this.arrow = this.create(64, 0, "items", 4);
		this.arrow.setVisible(false);
		//scene.add.existing(this);
		scene.physics.add.existing(this.player);
		scene.physics.add.collider(this.player, scene.ground);
		this.arrow.setVisible(true);
		this.player.body.setCircle(6, 3, 4);
		this.player.body.setCollideWorldBounds(true);
		this.setXY(config.width / 2, config.height - 64);

		//INPUT EVENTS
		this.cursors = scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});

		//Pointer events
		scene.input.on("pointerdown", (pointer) => {
			this.pointer = pointer;
			if (
				!this.throwball &&
				pointer.buttons === 1 &&
				this.ballCount > 0
			) {
				this.throwball = true;
				this.changeDirectionOnLanding(pointer);
			}
		});

		//Pointer events
		scene.input.on("pointermove", (pointer) => {
			this.pointer = pointer;
			if (this.throwball) {
				this.changeDirectionOnLanding(pointer);
			}
		});

		//Pointer events
		scene.input.on("pointerup", (pointer) => {
			this.pointer = pointer;
			if (this.throwball) {
				this.throwball = false;
				if (!this.inAir) {
					this.ballCount--;
					this.ball = new ThrowBall(
						scene,
						this.arrow.x,
						this.arrow.y,
						this.throwVel
					);
					ballPhysics(scene, this.ball);

					//Add collider for ball and player
					scene.physics.add.overlap(
						this.player,
						this.ball,
						(player, ball) => {
							ball.destroy();
							this.ballCount++;
						}
					);
				}
			}
		});

		//Take damage
		scene.physics.add.overlap(this.player, scene.bombs, (player, bomb) => {
			scene.gameState.lives--;
			if (scene.gameState.lives === 0) {
				if (this.ball) {
					this.ball.destroy();
				}
				this.player.body.setEnable(true);
				scene.input.off("pointerdown");
				scene.input.off("pointermove");
				scene.input.off("pointerup");
				scene.events.emit("fadeOut");
				return;
			}
			//Update bomb
			bomb.disableBody();
			bomb.setScale(1);
			bomb.setTexture("explosion");
			bomb.play("explosion", false);
			player.setTint(0x550000);
			setTimeout(() => {
				player.setTint(0xffffff);
			}, 200);
			bomb.once(
				"animationcomplete", //Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE
				() => {
					//Add the bomb after a delay
					scene.time.addEvent({
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
						},
						callbackScope: this,
						loop: false,
					});
				}
			);
		});

		// State Params
		this.velocity = { h: 0, v: 0 };
		this.inAir = false;
		this.throwball = false;
		this.direction = 0;
		this.changeDirection = false;
		this.dash = false;
		this.onLandingChange = false;

		//Ball params
		this.ballCount = 1;
		this.throwVel = { x: 0, y: 0 };
	}

	changeDirectionOnLanding(pointer) {
		if (!this.inAir) {
			if (pointer.x > this.player.x) {
				this.player.flipX = true;
			} else {
				this.player.flipX = false;
			}
		} else {
			if (pointer.x > this.player.x && !this.player.flipX) {
				this.onLandingChange = true;
			} else if (pointer.x <= this.player.x && this.player.flipX) {
				this.onLandingChange = true;
			}
		}
	}

	movement() {
		//Get normalised input direction
		this.velocity.h = 0;
		this.velocity.v = 0;
		if (!this.throwball) {
			if (this.cursors.left.isDown) {
				this.velocity.h -= 1;
			}
			if (this.cursors.right.isDown) {
				this.velocity.h += 1;
			}
			if (this.cursors.up.isDown) {
				this.velocity.v -= 1;
			}
			if (this.cursors.down.isDown) {
				this.velocity.v += 1;
			}
			const { x, y } = normalise({
				x: this.velocity.h,
				y: this.velocity.v,
			});
			this.velocity.h = x;
			this.velocity.v = y;
		}
		//Check if touching ground
		this.inAir = !this.player.body.onFloor();

		//check if changed direction while in air
		if (this.inAir) {
			if (this.direction === 1) {
				if (this.velocity.h < 0) {
					this.changeDirection = true;
				}
			} else if (this.direction === -1) {
				if (this.velocity.h > 0) {
					this.changeDirection = true;
				}
			}
		} else {
			//reset changeDirection to listen to next calls
			this.changeDirection = false;
			//as player is touching ground dash is not possible
			this.dash = false;
		}

		//Check if horizontal axis is not null
		if (this.velocity.h !== 0) {
			if (this.velocity.h > 0) {
				//if player has changed direction the speed will reduce
				if (this.inAir) {
					if (this.changeDirection) {
						this.player.body.setVelocityX(PLAYER.neg_air_speed);
					} else {
						this.player.body.setVelocityX(PLAYER.air_speed);
					}
				} else {
					this.player.body.setVelocityX(PLAYER.speed);
					this.direction = 1;
				}
			} else if (this.velocity.h < 0) {
				//if player has changed direction the speed will reduce
				if (this.inAir) {
					if (this.changeDirection) {
						this.player.body.setVelocityX(-PLAYER.neg_air_speed);
					} else {
						this.player.body.setVelocityX(-PLAYER.air_speed);
					}
				} else {
					this.player.body.setVelocityX(-PLAYER.speed);
					this.direction = -1;
				}
			}
		} else {
			//Finish the jump then go to rest
			if (!this.inAir) {
				this.player.body.setVelocityX(0);
			}
		}

		//Check if vertical axis is not null
		if (this.velocity.v !== 0) {
			if (this.cursors.up.isDown && !this.inAir) {
				this.player.body.setVelocityY(-PLAYER.jump_force);
			}
			if (this.cursors.down.isDown && this.inAir) {
				this.player.body.setVelocity(0, PLAYER.dash_speed);
				this.dash = true;
			}
		}
	}

	animation() {
		if (!this.onLandingChange) {
			if (this.velocity.h > 0) {
				this.player.flipX = true;
			} else if (this.velocity.h < 0) {
				this.player.flipX = false;
			}
		} else {
			if (!this.inAir) {
				this.player.flipX = !this.player.flipX;
				this.onLandingChange = false;
			}
		}

		if (this.inAir) {
			if (this.dash) {
				this.player.play("player_dash", true);
			} else {
				this.player.play("player_jump", false);
			}
		} else {
			if (!this.throwball) {
				if (this.velocity.h !== 0) {
					this.player.play("player_run", true);
				} else {
					this.player.play("player_idle", true);
				}
			} else {
				this.player.play("player_throw", false);
			}
		}
	}

	arrowState() {
		//TODO: Arrow show and rotate in direction of mouse when throw ball and should hide when ball is thrown
		if (this.pointer !== undefined && !this.inAir) {
			if (this.throwball) {
				this.arrow.setVisible(true);
			} else {
				this.arrow.setVisible(false);
			}

			const rad = Phaser.Math.Angle.Between(
				this.pointer.x,
				this.pointer.y,
				this.player.x,
				this.player.y
			);

			const out = Phaser.Math.RotateAroundDistance(
				new Phaser.Geom.Point(this.player.x + 64, this.player.y),
				this.player.x,
				this.player.y,
				rad + Phaser.Math.DegToRad(180),
				64
			);
			this.throwVel = {
				x: Math.cos(rad + Phaser.Math.DegToRad(180)),
				y: Math.sin(rad + Phaser.Math.DegToRad(180)),
			};
			this.arrow.x = out.x;
			this.arrow.y = out.y;
			this.arrow.angle = Phaser.Math.RadToDeg(rad) + 180;
		} else {
			this.arrow.setVisible(false);
		}
	}

	update() {
		this.movement();
		this.animation();
		this.arrowState();
	}
}

const LIVE_SPAWN = 10;
const BOMB_SPAWN = 15;
function ballPhysics(scene, ball) {
	scene.physics.add.overlap(ball, scene.bombs, (ball, bomb) => {
		if (scene.gameState.lives === 0) {
			ball.destroy();
			return;
		}
		scene.gameState.score++;
		if (scene.gameState.score % LIVE_SPAWN === 0) {
			let heart = new PickUp(scene);
			scene.physics.add.overlap(heart, scene.player, () => {
				scene.gameState.lives++;
				heart.destroy();
			});
		}
		if (scene.gameState.score % BOMB_SPAWN === 0) {
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
