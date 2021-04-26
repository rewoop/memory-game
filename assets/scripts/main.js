let scene = new Phaser.Scene('Game');

scene.preload = () => {
	scene.load.image('bg', 'assets/sprites/background.jpeg');
};

scene.create = () => {
	//scene.add.sprite(scene.sys.game.config.width / 2, scene.sys.game.config.height / 2, 'bg');
	scene.add.sprite(0, 0, 'bg').setOrigin(0, 0);
};

let config = {
	type: Phaser.AUTO, // webgl or canvas (if webgl doesn't work)
	width: 1920,
	height: 1080,
	scene: scene,
};

let game = new Phaser.Game(config);

//TODO: сделать вебпак сборку, чекнуть статью на хабре (вкладка "что почитать")
