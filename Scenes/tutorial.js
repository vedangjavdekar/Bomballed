class Tutorial extends Phaser.Scene {
	constructor() {
		super("tutorial");
	}

	preload() {}

	create() {
		let graphics = this.add.graphics();
		graphics.fillStyle(0xffffff, 1);
		graphics.fillRoundedRect(20, 20, 300, 400, 10);

		this.add
			.text(170, 30, "Objective", {
				font: "24px pixelfont",
				fill: "#454545",
			})
			.setOrigin(0.5, 0);

		this.add
			.text(450, 30, "CONTROLS", {
				font: "24px pixelfont",
				fill: "white",
			})
			.setOrigin(0.5, 0);

		this.add.sprite(360, 70, "mouse", 0).setScale(2).setOrigin(0.5, 0);
		this.add.sprite(360, 110, "mouse", 1).setScale(2).setOrigin(0.5, 0);
		this.add.text(400, 70, "aim: hold and move\nShoot: release", {
			font: "24px pixelfont",
			fill: "white",
			wordWrap: { width: 250 },
		});

		this.add.text(
			400,
			110,
			"Change Weapon: click\nCharged throw: hold down n release",
			{
				font: "24px pixelfont",
				fill: "white",
				wordWrap: { width: 250 },
			}
		);

		this.add
			.text(
				170,
				70,
				"Avoid as many bombs as possible.\nExplode them with your weapon to gain points and lives.",
				{
					font: "24px pixelfont",
					fill: "#454545",
					wordWrap: { width: 280 },
					lineSpacing: 5,
				}
			)
			.setOrigin(0.5, 0);

		graphics.fillStyle(0xff4d4d);
		graphics.fillRoundedRect(70, 182, 36, 36, 5);
		this.add.sprite(88, 200, "items", 1).setScale(2);
		this.add
			.text(88, 230, "Avoid", {
				font: "20px pixelfont",
				fill: "#ff4d4d",
				align: "center",
			})
			.setOrigin(0.5, 0);

		graphics.fillStyle(0x454545);
		graphics.fillRoundedRect(130, 182, 36, 36, 5);
		this.add.sprite(148, 200, "weapons", 0).setScale(2);

		graphics.fillRoundedRect(130, 230, 36, 36, 5);
		this.add.sprite(148, 248, "weapons", 1).setScale(2);
		this.add
			.text(148, 270, "Weapons", {
				font: "20px pixelfont",
				fill: "#454545",
				align: "center",
			})
			.setOrigin(0.5, 0);

		graphics.fillRoundedRect(192, 182, 36, 36, 5);
		this.add.sprite(210, 200, "items", 3).setScale(2);
		this.add
			.text(210, 230, "Lives", {
				font: "20px pixelfont",
				fill: "#ff4848",
				align: "center",
			})
			.setOrigin(0.5, 0);

		this.add
			.text(
				170,
				300,
				"Periodically Lives will be spawned.\nBut bombs will be added too! Play safe!",
				{
					font: "24px pixelfont",
					fill: "#454545",
					wordWrap: { width: 280 },
					lineSpacing: 5,
				}
			)
			.setOrigin(0.5, 0);

		let keys = this.add.container();
		let key_W = this.add.image(42, 0, "keys", 0).setScale(2);
		let W_text = this.add
			.text(42, -40, "Jump", {
				font: "20px pixelfont",
				fill: "white",
			})
			.setOrigin(0.5, 0);
		let key_S = this.add.image(42, 42, "keys", 1).setScale(2);
		let S_text = this.add
			.text(42, 62, "Dash", {
				font: "20px pixelfont",
				fill: "white",
			})
			.setOrigin(0.5, 0);
		let key_A = this.add.image(0, 42, "keys", 2).setScale(2);
		let A_text = this.add
			.text(-10, 62, "Left", {
				font: "20px pixelfont",
				fill: "white",
			})
			.setOrigin(0.5, 0);
		let key_D = this.add.image(84, 42, "keys", 3).setScale(2);
		let D_text = this.add
			.text(98, 62, "Right", {
				font: "20px pixelfont",
				fill: "white",
			})
			.setOrigin(0.5, 0);

		let runLeft = this.add
			.sprite(-60, 42, "player")
			.setScale(4)
			.play("player_run");

		let runRight = this.add
			.sprite(150, 42, "player")
			.setScale(4)
			.play("player_run");
		runRight.flipX = true;

		let jump = this.add
			.sprite(72, -90, "player")
			.setScale(4)
			.play("player_jump");

		this.tweens.add({
			targets: jump,
			x: 12,
			duration: 600,
			ease: "linear",
			repeat: -1,
		});
		this.tweens.add({
			targets: jump,
			y: -100,
			duration: 300,
			ease: "linear",
			repeat: -1,
			yoyo: true,
		});

		let dash = this.add
			.sprite(42, 120, "player")
			.setScale(4)
			.play("player_dash");

		this.tweens.add({
			targets: dash,
			y: 140,
			duration: 300,
			ease: "linear",
			repeat: -1,
		});

		keys.add(key_W);
		keys.add(W_text);
		keys.add(key_S);
		keys.add(S_text);
		keys.add(key_A);
		keys.add(A_text);
		keys.add(key_D);
		keys.add(D_text);

		keys.add(runLeft);
		keys.add(runRight);
		keys.add(jump);
		keys.add(dash);
		keys.x = 425;
		keys.y = 300;

		let back = this.add
			.text(30, 440, "< Back", {
				font: "36px pixelfont",
				fill: "white",
			})
			.setOrigin(0, 0.5)
			.setInteractive();

		back.on("pointerover", () => {
			back.setFontSize("40px");
		});
		back.on("pointerout", () => {
			back.setFontSize("36px");
		});

		back.on("pointerdown", () => {
			let blackrect = this.add.image(0, 0, "blackrect").setOrigin(0);
			this.tweens.add({
				targets: blackrect,
				alpha: { from: 0, to: 1 },
				repeat: 0,
				duration: FADE_DURATION,
				ease: "cubic",
				onComplete: () => {
					this.scene.start("mainmenu");
				},
			});
		});

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
}
