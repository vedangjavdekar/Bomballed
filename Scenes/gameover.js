class GameOver extends Phaser.Scene {
	constructor() {
		super("gameover");
	}
	preload() {}

	create(data) {
		const best = localStorage.getItem("bomballed_highScore");
		console.log(best);
		this.add
			.text(config.width / 2, 50, "GAME OVER", {
				fontFamily: "pixelfont",
				fontSize: "36px",
				fill: "white"
			})
			.setOrigin(0.5);

		let playAgain = this.add
			.text(config.width / 2, 120, "PLAY AGAIN", {
				fontFamily: "pixelfont",
				fontSize: "20px",
				fill: "white"
			})
			.setOrigin(0.5)
			.setInteractive();

		let mainMenu = this.add
			.text(config.width / 2, 180, "MAIN MENU", {
				fontFamily: "pixelfont",
				fontSize: "20px",
				fill: "white"
			})
			.setOrigin(0.5)
			.setInteractive();

		const style = {
			font: "24px pixelfont",
			fill: "white"
		};

		this.add
			.text(
				config.width / 2,
				config.height / 2 + 60,
				"Best Score:",
				style
			)
			.setOrigin(0.5, 0);
		if (best !== null) {
			if (data.score > best) {
				localStorage.setItem("bomballed_highScore", data.score);
				this.add
					.text(
						config.width / 2,
						config.height / 2 + 90,
						data.score,
						style
					)
					.setOrigin(0.5, 0);
			} else {
				this.add
					.text(config.width / 2, config.height / 2 + 90, best, style)
					.setOrigin(0.5, 0);
			}
		} else {
			localStorage.setItem("bomballed_highScore", data.score);
			this.add
				.text(
					config.width / 2,
					config.height / 2 + 90,
					data.score,
					style
				)
				.setOrigin(0.5, 0);
		}
		this.add
			.text(
				config.width / 2,
				config.height / 2 + 130,
				"Your Score:",
				style
			)
			.setOrigin(0.5, 0);
		this.add
			.text(config.width / 2, config.height / 2 + 160, data.score, style)
			.setOrigin(0.5, 0);

		playAgain.on("pointerover", () => {
			playAgain.setTint(0x454545);
		});
		playAgain.on("pointerout", () => {
			playAgain.setTint(0xffffff);
		});
		playAgain.on("pointerdown", () => {
			let blackrect = this.add.image(0, 0, "blackrect").setOrigin(0);
			this.tweens.add({
				targets: blackrect,
				alpha: { from: 0, to: 1 },
				repeat: 0,
				duration: FADE_DURATION,
				ease: "cubic",
				onComplete: () => {
					this.scene.start("playgame");
				}
			});
		});

		mainMenu.on("pointerover", () => {
			mainMenu.setTint(0x454545);
		});
		mainMenu.on("pointerout", () => {
			mainMenu.setTint(0xffffff);
		});
		mainMenu.on("pointerdown", () => {
			let blackrect = this.add.image(0, 0, "blackrect").setOrigin(0);
			this.tweens.add({
				targets: blackrect,
				alpha: { from: 0, to: 1 },
				repeat: 0,
				duration: FADE_DURATION,
				ease: "cubic",
				onComplete: () => {
					this.scene.start("mainmenu");
				}
			});
		});
	}

	update() {}
}
