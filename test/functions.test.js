const expect = chai.expect;
const assert = chai.assert;

describe('Find the Ace unit tests for functions', () => {
	it('Should return correct score based on the round number ', () => {
		expect(calculateScoreToAdd(1)).to.equal(100);
		expect(calculateScoreToAdd(2)).to.equal(50);
		expect(calculateScoreToAdd(3)).to.equal(25);
		expect(calculateScoreToAdd(4)).to.equal(10);
	});
});
