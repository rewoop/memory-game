class GameScene extends Phaser.Scene {
	constructor() {
		super('Game');

		this.isPlaying = false;
		this.currentPoints = 0;
		this.similarCardsCount = 0;
	}

	preload() {
		this.load.image('bg', 'assets/sprites/background.jpeg');
		this.load.image('card', 'assets/sprites/card.png');
		this.load.image('card1', 'assets/sprites/card1.png');
		this.load.image('card2', 'assets/sprites/card2.png');
		this.load.image('card3', 'assets/sprites/card3.png');
		this.load.image('card4', 'assets/sprites/card4.png');
		this.load.image('card5', 'assets/sprites/card5.png');

		this.load.image('play', 'assets/sprites/play-button.svg');
		this.load.image('restart', 'assets/sprites/update-arrow.svg');

		this.load.audio('card', 'assets/sounds/card.mp3');
		this.load.audio('complete', 'assets/sounds/complete.mp3');
		this.load.audio('success', 'assets/sounds/success.mp3');
		this.load.audio('theme', 'assets/sounds/theme.mp3');
		this.load.audio('timeout', 'assets/sounds/timeout.mp3');
	}

	checkLevelOptions() {
		switch (config.level) {
			case 1:
				config.cards = [1];
				config.timeout = 3;
				config.cols = 2;
				break;
			case 2:
				config.cards = [1, 2, 3];
				config.timeout = 20;
				config.cols = 3;
				break;
			case 3:
				config.cards = [1, 2, 3, 4];
				config.timeout = 25;
				config.cols = 4;
				break;
			case 4:
				config.cards = [1, 2, 3, 4, 5];
				config.timeout = 30;
				config.cols = 5;
				break;
			case 5:
				config.cards = [1, 2, 3, 4, 5];
				config.timeout = 25;
				break;
			case 6:
				config.cards = [1, 2, 3, 4, 5];
				config.timeout = 20;
				break;
			case 7:
				config.cards = [1, 2, 3, 4, 5];
				config.timeout = 15;
				break;
		}

		this.createCards();
	}

	setCurrentPoints() {
		switch (true) {
			case this.similarCardsCount === 1:
				this.currentPoints = this.currentPoints + 100;
				this.pointsText.setText('Points: ' + this.currentPoints);
				break;
			case this.similarCardsCount === 2:
				this.currentPoints = this.currentPoints + 250;
				this.pointsText.setText('Points: ' + this.currentPoints);
				break;
			case this.similarCardsCount === 3:
				this.currentPoints = this.currentPoints + 500;
				this.pointsText.setText('Points: ' + this.currentPoints);
				break;
			case this.similarCardsCount === 4:
				this.currentPoints = this.currentPoints + 1000;
				this.pointsText.setText('Points: ' + this.currentPoints);
				break;
			case this.similarCardsCount >= 5:
				this.currentPoints = this.currentPoints + 5000;
				this.pointsText.setText('Points: ' + this.currentPoints);
				break;
		}
	}

	clearWhenEnd() {
		this.cards.forEach(card => card.destroy());
		this.timeoutText.setText('');
		this.levelText.setText('');
		this.pointsText.setText('');
		this.timer.paused = true;

		if (this.timerHeaderText || this.timerMainText || this.earnedPointsText || this.restartBtn) {
			this.timerHeaderText.destroy();
			this.timerMainText.destroy();
			this.earnedPointsText.destroy();
			this.restartBtn.destroy();
		}
	}

	generateButtonHandler(targets, onComplete) {
		return () => {
			this.tweens.add({
				targets,
				scaleY: 0,
				ease: 'Linear',
				duration: 300,
				onComplete,
			});
			this.currentPoints = 0;
			this.similarCardsCount = 0;
		};
	}

	generateHandlers = (targets, onComplete, btn) => {
		btn.on('pointerdown', this.generateButtonHandler(targets, onComplete));
		btn.on('pointerover', () => btn.setTint(0xf55f5f));
		btn.on('pointerout', () => btn.clearTint());
	};

	createText() {
		this.timeoutText = this.add.text(20, 480, '', {
			font: '50px Novella',
			fill: '#fff',
		});

		this.levelText = this.add.text(1700, 480, '', {
			font: '50px Novella',
			fill: '#fff',
		});

		this.pointsText = this.add.text(840, 25, '', {
			font: '50px Novella',
			fill: '#fff',
		});
	}

	onTimerEnd() {
		this.clearWhenEnd();

		this.timerHeaderText = this.add.text(
			this.sys.game.config.width / 2 - 420,
			this.sys.game.config.height / 2 - 450,
			'No way. You lose...',
			{
				font: '120px Novella',
				fill: '#fff',
			}
		);

		this.timerMainText = this.add.text(
			this.sys.game.config.width / 2 - 700,
			this.sys.game.config.height / 2 - 250,
			'if you want to restart - click the button below',
			{
				font: '80px Novella',
				fill: '#fff',
			}
		);

		this.earnedPointsText = this.add.text(
			this.sys.game.config.width / 2 - 350,
			this.sys.game.config.height / 2 + 250,
			`You earned: ${this.currentPoints} points`,
			{
				font: '80px Novella',
				fill: '#fff',
			}
		);

		this.restartBtn = this.add
			.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'restart')
			.setInteractive({ cursor: 'pointer' });

		const onComplete = () => {
			this.restartBtn.destroy();
			this.isPlaying = true;
			config.cards = [];
			config.level = 1;
			this.sounds.theme.stop();
			this.create();
		};

		this.generateHandlers(
			[this.restartBtn, this.timerHeaderText, this.timerMainText, this.earnedPointsText],
			onComplete,
			this.restartBtn
		);
	}

	onTimerTick() {
		this.timeoutText.setText('Time: ' + this.timeout);

		if (this.timeout < 0) {
			this.timer.paused = true;
			this.sounds.timeout.play();
			this.onTimerEnd();
		} else {
			--this.timeout;
		}
	}
	createTimer() {
		this.timer = this.time.addEvent({
			delay: 1000,
			callback: this.onTimerTick,
			callbackScope: this,
			loop: true,
		});
	}
	createSounds() {
		this.sounds = {
			card: this.sound.add('card'),
			complete: this.sound.add('complete'),
			success: this.sound.add('success'),
			theme: this.sound.add('theme'),
			timeout: this.sound.add('timeout'),
		};
		this.sounds.theme.play({ volume: 0.1 });
	}

	createStartingText() {
		const headerText = this.add.text(
			this.sys.game.config.width / 2 - 210,
			this.sys.game.config.height / 2 - 450,
			'Hey, bro!',
			{
				font: '120px Novella',
				fill: '#fff',
			}
		);
		const mainText = this.add.text(
			this.sys.game.config.width / 2 - 580,
			this.sys.game.config.height / 2 - 250,
			'click play button below if u wanna play',
			{
				font: '80px Novella',
				fill: '#fff',
			}
		);

		this.playBtn = this.add
			.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'play')
			.setInteractive({ cursor: 'pointer' });

		const onComplete = () => {
			this.playBtn.destroy();
			this.isPlaying = true;
			this.create();
		};

		this.generateHandlers([this.playBtn, headerText, mainText], onComplete, this.playBtn);
	}

	createEndingText() {
		this.clearWhenEnd();

		const headerText = this.add.text(
			this.sys.game.config.width / 2 - 210,
			this.sys.game.config.height / 2 - 450,
			'YOU WIN!',
			{
				font: '120px Novella',
				fill: '#f55f5f',
			}
		);
		const mainText = this.add.text(
			this.sys.game.config.width / 2 - 420,
			this.sys.game.config.height / 2 - 250,
			'You are f*cking incredible!',
			{
				font: '80px Novella',
				fill: '#fff',
			}
		);

		const earnedPointsText = this.add.text(
			this.sys.game.config.width / 2 - 350,
			this.sys.game.config.height / 2 + 250,
			`You earned: ${this.currentPoints} points`,
			{
				font: '80px Novella',
				fill: '#fff',
			}
		);

		this.endButton = this.add
			.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'restart')
			.setInteractive({ cursor: 'pointer' });

		const onComplete = () => {
			this.endButton.destroy();
			this.isPlaying = true;
			config.cards = [];
			config.level = 1;
			this.sounds.theme.stop();
			this.create();
		};

		this.generateHandlers([this.endButton, headerText, mainText, earnedPointsText], onComplete, this.endButton);
	}

	create() {
		this.createBackground();

		if (this.isPlaying) {
			this.createSounds();
			this.playBtn.destroy();
			this.timeout = config.timeout;
			this.createTimer();
			this.createText();
			this.createCards();
			this.start();
		} else {
			this.createStartingText();
		}
	}

	restart() {
		let count = 0;

		const onCardMoveComplete = () => {
			++count;
			if (count >= this.cards.length) {
				this.start();
			}
		};

		this.cards.forEach(card => {
			card.move({
				x: this.sys.game.config.width + card.width,
				y: this.sys.game.config.height + card.height,
				delay: card.position.delay,
				callback: onCardMoveComplete,
			});
		});
	}

	start() {
		if (config.level < 2) {
			this.checkLevelOptions();
			this.initCardsPositions();
			this.timeout = config.timeout;
			this.openedCard = null;
			this.openedCardsCount = 0;
			this.timer.paused = false;
			this.levelText.setText('Level: ' + config.level);
			this.pointsText.setText('Points: ' + this.currentPoints);
			this.initCards();
			this.showCards();
			config.level++;
		} else {
			this.createEndingText();
		}
	}

	initCards() {
		const positions = Phaser.Utils.Array.Shuffle(this.positions);

		this.cards.forEach(card => {
			card.init(positions.pop());
		});
	}

	showCards() {
		this.cards.forEach(card => {
			card.depth = card.position.delay;
			card.move({
				x: card.position.x,
				y: card.position.y,
				delay: card.position.delay,
			});
		});
	}

	createBackground() {
		this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
	}

	createCards() {
		this.cards = [];

		for (let value of config.cards) {
			for (let i = 0; i < 2; i++) {
				const currentCard = new Card(this, value);
				this.cards.push(currentCard);
				currentCard.on('pointerdown', () => this.onCardClicked(currentCard));
			}
		}
	}

	onCardClicked(card) {
		if (card.opened) {
			return false;
		}

		this.sounds.card.play();

		if (this.openedCard) {
			// уже есть открытая карта
			if (this.openedCard.value === card.value) {
				// картинки равны - запомнить
				this.similarCardsCount++;
				this.setCurrentPoints();
				this.sounds.success.play();
				this.openedCard = null;
				++this.openedCardsCount;
			} else {
				// картинки разные - скрыть прошлую
				this.similarCardsCount = 0;
				this.setCurrentPoints();
				this.openedCard.close();
				this.openedCard = card;
			}
		} else {
			// еще нет открытой карты
			this.openedCard = card;
		}

		card.open(() => {
			if (this.openedCardsCount === this.cards.length / 2) {
				this.sounds.complete.play();
				this.restart();
			}
		});
	}

	initCardsPositions() {
		const positions = [];
		const cardTexture = this.textures.get('card').getSourceImage();
		const cardWidth = cardTexture.width + 4;
		const cardHeight = cardTexture.height + 4;
		const offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2;
		const offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;

		let id = 0;
		for (let row = 0; row < config.rows; row++) {
			for (let col = 0; col < config.cols; col++) {
				++id;
				positions.push({
					delay: id * 100,
					x: offsetX + col * cardWidth,
					y: offsetY + row * cardHeight,
				});
			}
		}
		this.positions = positions;
	}
}
