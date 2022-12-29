const expect = chai.expect;
const assert = chai.assert;

describe('Find the Ace unit tests for variables', () => {
	it('Should be an array', () => {
		assert.isArray(cardObjectDefinitions, 'cardObjectDefinitions is an array');
		assert.isArray(cards, 'cards is an array');
		assert.isArray(cardPositions, 'cardPositions is an array');
	});

	it('Should have a value of 4 or 0', () => {
		assert.equal(aceId, '4', 'aceId has a value of 4');
		assert.equal(numCards, '4', 'numCards has a value of 4');
		assert.lengthOf(
			cardObjectDefinitions,
			4,
			'cardObjectDefinitions has length of 4'
		);
		expect(maxRounds).to.equal(4);
		expect(roundNum).to.equal(0);
		expect(score).to.equal(0);
	});

	it('Should deep equal defined value', () => {
		assert.deepEqual(
			cardBackImgPath,
			'./images/card-back-Blue.png',
			'cardBackImgPath is correctly set'
		);
		assert.deepEqual(
			cardCollectionCellClass,
			'.card-pos-a',
			'cardCollectionCellClass is correctly set'
		);
	});

	it('Should be empty', () => {
		expect(cards).to.be.empty;
		expect(cardPositions).to.be.empty;
		expect(gameObject).to.be.empty;
	});

	it('Should be false', () => {
		expect(gameInProgress, 'gameInProgress is false').to.be.false;
		expect(shufflingInProgress, 'shufflingInProgress is false').to.be.false;
		expect(cardsRevealed, 'cardsRevealed is false').to.be.false;
	});

	it('Should be string', () => {
		expect(winColor).to.have.string('green');
		expect(loseColor).to.have.string('red');
		expect(primaryColor).to.have.string('black');
		expect(localStorageGameKey).to.have.string('FTA');
	});

	it('Should be an object', () => {
		assert.isObject(gameObject, 'gameObject is an object');
	});
});
