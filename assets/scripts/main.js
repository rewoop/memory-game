import { GameScene } from './GameScene';

export const config = {
	type: Phaser.AUTO, // webgl or canvas
	width: 1920,
	height: 1080,
	rows: 2,
	cols: 5,
	level: 1,
	cards: [],
	timeout: 15,
	scene: new GameScene(),
};

export const game = new Phaser.Game(config);
