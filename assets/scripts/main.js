const config = {
	type: Phaser.AUTO, // webgl or canvas
	width: 1920,
	height: 1080,
	rows: 2,
	cols: 5,
	cards: [1, 2, 3, 4, 5],
	timeout: 30,
	scene: new GameScene(),
};

const game = new Phaser.Game(config);
