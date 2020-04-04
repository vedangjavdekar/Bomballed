class PlayGame extends Phaser.Scene {
	constructor() {
		super("playgame");
	}

	preload() {
		this.input.mouse.disableContextMenu();
		this.gameState = {
			player: {},
			score: 0,
			lives: 3,
			objects: 4,
		};
	}

	create() {
		//BG
		this.background = this.add
			.tileSprite(0, 0, config.width, config.height, "background")
			.setOrigin(0, 0);

		//Score Text
		this.scoreText = this.add.text(20, 20, "score: ", {
			fontFamily: "pixelfont",
			fontSize: "20px",
			fill: "white",
		});
		//lives Text
		//#ff4d6d
		this.livesText = this.add.text(20, 45, "lives: x x x", {
			fontFamily: "pixelfont",
			fontSize: "20px",
			fill: "white",
		});

		//GROUND
		const gnd = this.add
			.tileSprite(0, config.height - 16, config.width, 16, "items", 0)
			.setScale(2);
		this.ground = this.physics.add.existing(gnd, true);
		this.ground.body.updateFromGameObject();
		//custom event
		this.events.once("fadeOut", this.fadeOut, this);
		//physics objects
		this.bombs = this.physics.add.group();
		for (let i = 0; i < this.gameState.objects; i++) {
			let bomb = this.physics.add.sprite(16, 16, "items", 2).setScale(2);
			this.bombs.add(bomb);
			bomb.setRandomPosition(
				0,
				0,
				game.config.width,
				game.config.height / 2 - 32
			);
			bomb.setCircle(8);
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(50, 50);
		}
		//Collision
		this.physics.add.collider(this.bombs, this.ground);

		//PLAYER SPRITE
		this.player = new Player(this, config.width / 2, config.height - 64);
		this.fadeIn();
	}

	fadeOut() {
		this.physics.timescale = 0;
		let blackrect = this.add.image(0, 0, "blackrect").setOrigin(0);
		this.tweens.add({
			targets: blackrect,
			alpha: { from: 0, to: 1 },
			repeat: 0,
			duration: FADE_DURATION,
			ease: "cubic",
			onComplete: () => {
				this.scene.start("gameover", { score: this.gameState.score });
			},
		});
	}

	fadeIn() {
		let blackrect = this.add.image(0, 0, "blackrect").setOrigin(0);
		this.tweens.add({
			targets: blackrect,
			alpha: { from: 1, to: 0 },
			repeat: 0,
			duration: FADE_DURATION,
			ease: "linear",
			onComplete: () => {
				blackrect.destroy();
			},
		});
	}

	update() {
		if (this.gameState.lives === 0) {
			this.events.emit("fadeOut");
			return;
		}
		this.background.tilePositionX += 0.5;
		this.player.update();
		this.scoreText.text = "score: " + this.gameState.score;
		this.livesText.text = this.livesUpdate();
	}

	moveItems(item, speed) {
		item.y += speed;
		if (item.y > config.height) {
			item.x = Phaser.Math.Between(0, config.width);
			item.y = 0;
		}
	}

	livesUpdate() {
		let s = "";
		for (let x = 0; x < this.gameState.lives; x++) {
			s += " x";
		}
		return "lives: " + s;
	}
}
