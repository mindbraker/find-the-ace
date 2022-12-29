const cardObjectDefinitions = [
	{ id: 1, imagePath: './images/card-King-of-Hearts.png' },
	{ id: 2, imagePath: './images/card-Jack-of-Clubs.png' },
	{ id: 3, imagePath: './images/card-Queen-of-Diamonds.png' },
	{ id: 4, imagePath: './images/card-Ace-of-Spades.png' }
];

const aceId = 4;

const cardBackImgPath = './images/card-back-Blue.png';

let cards = [];

const playGameButtonElement = document.getElementById('playGameButton');
const cardContainerElement = document.querySelector('.card-container');

const collapsedGridAreaTemplate = '"a a" "a a"';
const cardCollectionCellClass = '.card-pos-a';

const numCards = cardObjectDefinitions.length;

let cardPositions = [];

let gameInProgress = false;
let shufflingInProgress = false;
let cardsRevealed = false;

const currentGameStatusElement = document.querySelector('.current-status');
const scoreContainerElement = document.querySelector('.header-score-container');
const scoreElement = document.querySelector('.score');
const roundContainerElement = document.querySelector('.header-round-container');
const roundElement = document.querySelector('.round');

const winColor = 'green';
const loseColor = 'red';
const primaryColor = 'black';

let roundNum = 0;
let maxRounds = 4;
let score = 0;

let gameObject = {};
const localStorageGameKey = 'FTA';

loadGame();

function gameOver() {
	updateStatusElement(scoreContainerElement, 'none');
	updateStatusElement(roundContainerElement, 'none');

	const gameOverMessage = `Game Over! Final score <span class='badge'>${score}</span>`;
	updateStatusElement(
		currentGameStatusElement,
		'block',
		primaryColor,
		gameOverMessage
	);

	gameInProgress = false;
	playGameButtonElement.disabled = false;
}

function endRound() {
	setTimeout(() => {
		if (roundNum == maxRounds) {
			gameOver();
			return;
		} else {
			startRound();
		}
	}, 2_000);
}

function chooseCard(card) {
	if (canChooseCard()) {
		evalutateCardChoice(card);
		saveGameObjectToLocalStorage(score, roundNum);
		flipCard(card, false);

		setTimeout(() => {
			flipCards(false);
			updateStatusElement(
				currentGameStatusElement,
				'block',
				primaryColor,
				'Card positions revealed'
			);

			endRound();
		}, 2_000);
		cardsRevealed = true;
	}
}

function calculateScoreToAdd(roundNumber) {
	if (roundNumber == 1) {
		return 100;
	} else if (roundNumber == 2) {
		return 50;
	} else if (roundNumber == 3) {
		return 25;
	} else {
		return 10;
	}
}

function calculateScore() {
	const scoreToAdd = calculateScoreToAdd(roundNum);
	score = score + scoreToAdd;
}

function updateScore() {
	calculateScore();
	updateStatusElement(
		scoreElement,
		'block',
		primaryColor,
		`Score <span class='badge'>${score}</span>`
	);
}

function updateStatusElement(element, display, color, innerHTML) {
	element.style.display = display;

	if (arguments.length > 2) {
		element.style.color = color;
		element.innerHTML = innerHTML;
	}
}

function outputChoiceFeedback(hit) {
	if (hit) {
		updateStatusElement(
			currentGameStatusElement,
			'block',
			winColor,
			'You have found the A♠️! 🎉'
		);
	} else {
		updateStatusElement(
			currentGameStatusElement,
			'block',
			loseColor,
			'Missed! 😭'
		);
	}
}

function evalutateCardChoice(card) {
	if (card.id == aceId) {
		updateScore();
		outputChoiceFeedback(true);
	} else {
		outputChoiceFeedback(false);
	}
}

function canChooseCard() {
	return gameInProgress == true && !shufflingInProgress && !cardsRevealed;
}

function loadGame() {
	createCards();

	cards = document.querySelectorAll('.card');

	cardFlyInEffect();

	playGameButtonElement.addEventListener('click', () => startGame());

	updateStatusElement(scoreContainerElement, 'none');
	updateStatusElement(roundContainerElement, 'none');
}

function checkForIncompleteGame() {
	const serializedGameObject = getLocalStorageItemValue(localStorageGameKey);

	if (serializedGameObject) {
		gameObject = getObjectFromJSON(serializedGameObject);

		if (gameObject.round >= maxRounds) {
			removeLocalStorageItem(localStorageGameKey);
		} else {
			if (confirm('Would you like to continue with your last game?')) {
				score = gameObject.score;
				roundNum = gameObject.round;
			}
		}
	}
}

function startGame() {
	initializeNewGame();
	startRound();
}

function initializeNewGame() {
	score = 0;
	roundNum = 0;

	checkForIncompleteGame();

	shufflingInProgress = false;

	updateStatusElement(scoreContainerElement, 'flex');
	updateStatusElement(roundContainerElement, 'flex');

	updateStatusElement(
		scoreElement,
		'block',
		primaryColor,
		`Score <span class='badge'>${score}</span>`
	);
	updateStatusElement(
		roundElement,
		'block',
		primaryColor,
		`Round <span class='badge'>${roundNum}</span>`
	);
}

function startRound() {
	initializeNewRound();
	collectCards();
	flipCards(true);
	shuffleCards();
}

function initializeNewRound() {
	roundNum++;
	playGameButtonElement.disabled = true;

	gameInProgress = true;
	shufflingInProgress = true;
	cardsRevealed = false;

	updateStatusElement(
		currentGameStatusElement,
		'block',
		primaryColor,
		'Shuffling...'
	);

	updateStatusElement(
		roundElement,
		'block',
		primaryColor,
		`Round <span class='badge'>${roundNum}</span>`
	);
}

function collectCards() {
	transformGridArea(collapsedGridAreaTemplate);
	addCardsToGridAreaCell(cardCollectionCellClass);
}

function transformGridArea(areas) {
	cardContainerElement.style.gridTemplateAreas = areas;
}

function addCardsToGridAreaCell(cellPositionClassName) {
	const cellPositionElement = document.querySelector(cellPositionClassName);

	cards.forEach((card) => {
		addChildElement(cellPositionElement, card);
	});
}

function flipCard(card, flipToBack) {
	const innerCardElement = card.firstChild;

	if (flipToBack && !innerCardElement.classList.contains('flip-it')) {
		innerCardElement.classList.add('flip-it');
	} else if (innerCardElement.classList.contains('flip-it')) {
		innerCardElement.classList.remove('flip-it');
	}
}

function flipCards(flipToBack) {
	cards.forEach((card, index) => {
		setTimeout(() => {
			flipCard(card, flipToBack);
		}, index * 100);
	});
}

function cardFlyInEffect() {
	const id = setInterval(flyIn, 5);
	let cardCount = 0;
	let count = 0;

	function flyIn() {
		count++;

		if (cardCount == numCards) {
			clearInterval(id);
			playGameButtonElement.style.display = 'inline-block';
		}

		if (count == 1 || count == 250 || count == 500 || count == 750) {
			cardCount++;
			let card = document.getElementById(cardCount);
			card.classList.remove('fly-in');
		}
	}
}

function removeShuffleClasses() {
	cards.forEach((card) => {
		card.classList.remove('shuffle-left');
		card.classList.remove('shuffle-right');
	});
}

function animateShuffle(shuffleCount) {
	const random1 = Math.floor(Math.random() * numCards) + 1;
	const random2 = Math.floor(Math.random() * numCards) + 1;

	let card1 = document.getElementById(random1);
	let card2 = document.getElementById(random2);

	if (shuffleCount % 4 == 0) {
		card1.classList.toggle('shuffle-left');
		card1.style.zIndex = 100;
	}
	if (shuffleCount % 10 == 0) {
		card2.classList.toggle('shuffle-right');
		card2.style.zIndex = 200;
	}
}

function shuffleCards() {
	let shuffleCount = 0;
	const id = setInterval(shuffle, 12);

	function shuffle() {
		randomizeCardPositions();

		animateShuffle(shuffleCount);

		if (shuffleCount == 500) {
			clearInterval(id);
			shufflingInProgress = false;
			removeShuffleClasses();
			dealCards();
			updateStatusElement(
				currentGameStatusElement,
				'block',
				primaryColor,
				'Please click on the card you think is the A♠️...'
			);
		} else {
			shuffleCount++;
		}
	}
}

function randomizeCardPositions() {
	const random1 = Math.floor(Math.random() * numCards) + 1;
	const random2 = Math.floor(Math.random() * numCards) + 1;

	const temp = cardPositions[random1 - 1];

	cardPositions[random1 - 1] = cardPositions[random2 - 1];
	cardPositions[random2 - 1] = temp;
}

function dealCards() {
	addCardsToAppropiateCell();
	const areasTemplate = returnGridAreasMappedToCardPosition();

	transformGridArea(areasTemplate);
}

function returnGridAreasMappedToCardPosition() {
	let firstPart = '';
	let secondPart = '';
	let areas = '';

	cards.forEach((card, index) => {
		if (cardPositions[index] == 1) {
			areas = areas + 'a ';
		} else if (cardPositions[index] == 2) {
			areas = areas + 'b ';
		} else if (cardPositions[index] == 3) {
			areas = areas + 'c ';
		} else if (cardPositions[index] == 4) {
			areas = areas + 'd ';
		}

		if (index == 1) {
			firstPart = areas.substring(0, areas.length - 1);
			areas = '';
		} else if (index == 3) {
			secondPart = areas.substring(0, areas.length - 1);
		}
	});

	return `"${firstPart}" "${secondPart}"`;
}

function addCardsToAppropiateCell() {
	cards.forEach((card) => {
		addCardToGridCell(card);
	});
}

function createCards() {
	cardObjectDefinitions.forEach((cardItem) => {
		createCard(cardItem);
	});
}

function createCard(cardItem) {
	// create div elements that make up a card
	const cardElement = createElement('div');
	const cardInnerElement = createElement('div');
	const cardFrontElement = createElement('div');
	const cardBackElement = createElement('div');

	// create front and back image elements for a card
	const cardFrontImage = createElement('img');
	const cardBackImage = createElement('img');

	// add class and id to card element
	addClassToElement(cardElement, 'card');
	addClassToElement(cardElement, 'fly-in');
	addIdToElement(cardElement, cardItem.id);

	// add class to inner card element
	addClassToElement(cardInnerElement, 'card-inner');

	// add class to front card element
	addClassToElement(cardFrontElement, 'card-front');

	// add class to back card element
	addClassToElement(cardBackElement, 'card-back');

	// add src attribute and appropiate value to img element - back of card
	addSrcToImageElement(cardBackImage, cardBackImgPath);

	// add src attribute and appropiate value to img element - front of card
	addSrcToImageElement(cardFrontImage, cardItem.imagePath);

	// assign class to back image element of back of card
	addClassToElement(cardBackImage, 'card-img');

	// assign class to back image element of front of card
	addClassToElement(cardFrontImage, 'card-img');

	// add back image element as child element to front card element
	addChildElement(cardFrontElement, cardFrontImage);

	// add back image element as child element to back card element
	addChildElement(cardBackElement, cardBackImage);

	// add front image element as child element to inner card element
	addChildElement(cardInnerElement, cardFrontElement);

	// add back image element as child element to inner card element
	addChildElement(cardInnerElement, cardBackElement);

	// add inner card element as child element to card element
	addChildElement(cardElement, cardInnerElement);

	// add card element as child element to appropiate grid cell
	addCardToGridCell(cardElement);

	initializeCardPositions(cardElement);

	attachClickEventHandlerToCard(cardElement);
}

function attachClickEventHandlerToCard(card) {
	card.addEventListener('click', () => chooseCard(card));
}

function initializeCardPositions(card) {
	cardPositions.push(card.id);
}

function createElement(elementType) {
	return document.createElement(elementType);
}

function addClassToElement(element, className) {
	element.classList.add(className);
}

function addIdToElement(element, id) {
	element.id = id;
}

function addSrcToImageElement(imgElement, src) {
	imgElement.src = src;
}

function addChildElement(parentElement, childElement) {
	parentElement.appendChild(childElement);
}

function addCardToGridCell(card) {
	const cardPositionClassName = mapCardIdToGridCell(card);
	const cardPositionElement = document.querySelector(cardPositionClassName);

	addChildElement(cardPositionElement, card);
}

function mapCardIdToGridCell(card) {
	console.log(card);
	if (card.id == 1) {
		return '.card-pos-a';
	} else if (card.id == 2) {
		return '.card-pos-b';
	} else if (card.id == 3) {
		return '.card-pos-c';
	} else if (card.id == 4) {
		return '.card-pos-d';
	}
}

// local storage functions
function getSerializedObjectAsJSON(obj) {
	return JSON.stringify(obj);
}

function getObjectFromJSON(json) {
	return JSON.parse(json);
}

function updateLocalStorageItem(key, value) {
	localStorage.setItem(key, value);
}

function getLocalStorageItemValue(key) {
	return localStorage.getItem(key);
}

function removeLocalStorageItem(key) {
	localStorage.removeItem(key);
}

function updateGameObject(score, round) {
	gameObject.score = score;
	gameObject.round = round;
}

function saveGameObjectToLocalStorage(score, round) {
	updateGameObject(score, round);
	updateLocalStorageItem(
		localStorageGameKey,
		getSerializedObjectAsJSON(gameObject)
	);
}
