let scene = new Phaser.Scene('Game');

scene.preload = () => {};

scene.create = () => {};

let config = {
	type: Phaser.AUTO, // webgl or canvas (if webgl doesn't work)
	width: 1920,
	height: 1080,
	scene: scene,
};

let game = new Phaser.Game(config);
