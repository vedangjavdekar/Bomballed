class MainMenu extends Phaser.Scene {
	constructor() {
		super("mainmenu");
	}
	preload() {}

	create() {
		this.add
			.image(config.width / 2 - 140, config.height / 2 - 50, "items", 3)
			.setScale(2);

		this.add
			.image(config.width / 2 + 140, config.height / 2 - 50, "items", 1)
			.setScale(2);

		let title = this.add
			.text(config.width / 2, config.height / 2 - 50, "BOMBALLED", {
				fontFamily: "pixelfont",
				fontSize: "48px",
				fill: "white",
			})
			.setOrigin(0.5);

		title.setShadow(0, 5, "#666666", 5, false, true);

		let play = this.add
			.text(config.width / 2, config.height / 2 + 30, "PLAY", {
				fontFamily: "pixelfont",
				fontSize: "36px",
				fill: "white",
			})
			.setOrigin(0.5)
			.setInteractive();

		let tutorial = this.add
			.text(config.width / 2, config.height / 2 + 80, "TUTORIAL", {
				fontFamily: "pixelfont",
				fontSize: "28px",
				fill: "white",
			})
			.setOrigin(0.5)
			.setInteractive();

		play.on("pointerover", () => {
			play.setFontSize(40);
			play.setTint(0x454545);
		});
		play.on("pointerout", () => {
			play.setFontSize(38);
			play.setTint(0xffffff);
		});
		play.on("pointerdown", () => {
			let blackrect = this.add.image(0, 0, "blackrect").setOrigin(0);
			this.tweens.add({
				targets: blackrect,
				alpha: { from: 0, to: 1 },
				repeat: 0,
				duration: FADE_DURATION,
				ease: "cubic",
				onComplete: () => {
					this.scene.start("playgame");
				},
			});
		});

		tutorial.on("pointerover", () => {
			tutorial.setFontSize(30);
			tutorial.setTint(0x454545);
		});
		tutorial.on("pointerout", () => {
			tutorial.setFontSize(28);
			tutorial.setTint(0xffffff);
		});
		tutorial.on("pointerdown", () => {
			let blackrect = this.add.image(0, 0, "blackrect").setOrigin(0);
			this.tweens.add({
				targets: blackrect,
				alpha: { from: 0, to: 1 },
				repeat: 0,
				duration: FADE_DURATION,
				ease: "cubic",
				onComplete: () => {
					this.scene.start("tutorial");
				},
			});
		});

		let blackrect = this.add.image(0, 0, "blackrect").setOrigin(0);
		this.tweens.add({
			targets: blackrect,
			alpha: { from: 1, to: 0 },
			repeat: 0,
			duration: FADE_DURATION,
			ease: "cubic",
			onComplete: () => {
				blackrect.destroy();
			},
		});
	}

	update() {}
}
