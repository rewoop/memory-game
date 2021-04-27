const config = {
	type: Phaser.AUTO, // webgl or canvas (if webgl doesn't work)
	width: 1920,
	height: 1080,
	rows: 2,
	cols: 5,
	cards: [1, 2, 3, 4, 5],
	scene: new GameScene(),
};

const game = new Phaser.Game(config);
