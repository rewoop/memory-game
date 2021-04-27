class GameScene extends Phaser.Scene {
	constructor() {
		super('Game');
	}

	preload() {
		this.load.image('bg', 'assets/sprites/background.jpeg');
		this.load.image('card', 'assets/sprites/card.png');
		this.load.image('card1', 'assets/sprites/card1.png');
		this.load.image('card2', 'assets/sprites/card2.png');
		this.load.image('card3', 'assets/sprites/card3.png');
		this.load.image('card4', 'assets/sprites/card4.png');
		this.load.image('card5', 'assets/sprites/card5.png');
	}

	create() {
		this.createBackground();
		this.createCards();
		this.start();
	}

	start() {
		this.openedCard = null;
		this.openedCardsCount = 0;
		this.initCards();
	}

	initCards() {
		const positions = this.getCardsPositions();

		this.cards.forEach(card => {
			const position = positions.pop();
			card.close();
			card.setPosition(position.x, position.y);
		});
	}

	createBackground() {
		this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
	}

	createCards() {
		this.cards = [];

		config.cards.forEach(value => {
			for (let i = 0; i < 2; i++) {
				this.cards.push(new Card(this, value));
			}
		});

		this.input.on('gameobjectdown', this.onCardClicked, this);
	}

	onCardClicked(pointer, card) {
		if (card.opened) {
			return false;
		}
		if (this.openedCard) {
			// уже есть открытая карта
			if (this.openedCard.value === card.value) {
				// картинки равны - запомнить
				this.openedCard = null;
				this.openedCardsCount++;
			} else {
				// картинки разные - скрыть прошлую
				this.openedCard.close();
				this.openedCard = card;
			}
		} else {
			// еще нет открытой карты
			this.openedCard = card;
		}
		card.open();

		if (this.openedCardsCount === this.cards.length / 2) {
			this.start();
		}
	}

	getCardsPositions() {
		const positions = [];
		const cardTexture = this.textures.get('card').getSourceImage();
		const cardWidth = cardTexture.width + 4;
		const cardHeight = cardTexture.height + 4;
		const offsetX = (this.sys.game.config.width - cardWidth * config.cols) / 2 + cardWidth / 2;
		const offsetY = (this.sys.game.config.height - cardHeight * config.rows) / 2 + cardHeight / 2;

		for (let row = 0; row < config.rows; row++) {
			for (let col = 0; col < config.cols; col++) {
				positions.push({
					x: offsetX + col * cardWidth,
					y: offsetY + row * cardHeight,
				});
			}
		}
		return Phaser.Utils.Array.Shuffle(positions);
	}
}
