class BootGame extends Phaser.Scene {
	constructor() {
		super("bootgame");
	}

	preload() {
		let graphics = this.add.graphics();
		graphics.fillStyle(0x000000, 1);
		graphics.fillRect(0, 0, config.width, config.height);
		graphics.generateTexture("blackrect", config.width, config.height);
		graphics.clear();

		this.load.image("background", "Assets/Sprites/sky.png");

		this.load.spritesheet("player", "Assets/Sprites/player.png", {
			frameWidth: 16,
			frameHeight: 16,
		});

		this.load.spritesheet("items", "Assets/Sprites/items.png", {
			frameWidth: 16,
			frameHeight: 16,
		});

		this.load.spritesheet("weapons", "Assets/Sprites/weapons.png", {
			frameWidth: 16,
			frameHeight: 16,
		});

		this.load.spritesheet("explosion", "Assets/Sprites/explosion.png", {
			frameWidth: 64,
			frameHeight: 64,
		});

		this.load.spritesheet("keys", "Assets/Sprites/keys.png", {
			frameWidth: 16,
			frameHeight: 16,
		});

		this.load.spritesheet("mouse", "Assets/Sprites/mouse.png", {
			frameWidth: 16,
			frameHeight: 18,
		});
	}

	create() {
		this.add.text(20, 20, "loading...", {
			fontFamily: "pixelfont",
			fontSize: "24px",
			fill: "white",
		});

		this.anims.create({
			key: "player_idle",
			frames: this.anims.generateFrameNumbers("player", {
				start: 0,
				end: 3,
			}),
			frameRate: 12,
			repeat: -1,
		});

		this.anims.create({
			key: "player_run",
			frames: this.anims.generateFrameNumbers("player", {
				start: 4,
				end: 7,
			}),
			frameRate: 12,
			repeat: -1,
		});

		this.anims.create({
			key: "player_jump",
			frames: this.anims.generateFrameNumbers("player", {
				start: 8,
				end: 8,
			}),
			frameRate: 12,
			repeat: -1,
		});

		this.anims.create({
			key: "player_dash",
			frames: this.anims.generateFrameNumbers("player", {
				start: 9,
				end: 12,
			}),
			frameRate: 8,
			repeat: -1,
		});

		this.anims.create({
			key: "player_throw_ball",
			frames: this.anims.generateFrameNumbers("player", {
				start: 13,
				end: 13,
			}),
			frameRate: 12,
			repeat: 0,
		});

		this.anims.create({
			key: "player_throw_boomerang",
			frames: this.anims.generateFrameNumbers("player", {
				start: 14,
				end: 14,
			}),
			frameRate: 12,
			repeat: 0,
		});

		this.anims.create({
			key: "explosion",
			frames: this.anims.generateFrameNumbers("explosion"),
			frameRate: 48,
			repeat: 0,
			hideOnComplete: true,
		});
		this.scene.start("mainmenu");
	}
}
