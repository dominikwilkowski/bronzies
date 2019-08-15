describe('The game', () => {
	beforeEach( () => {
		cy.fixture('signals.json').as('signals');
	});

	it('Counts score', function() {
		cy.visit('http://localhost:3000');
		// this.signals // the data to fin the correct answer for each question
	});
});
