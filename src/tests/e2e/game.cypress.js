function convertQuestions( questions ) {
	const newQuestions = {};
	questions.map( question => {
		newQuestions[ question.image ] = question;
	});
	return newQuestions;
}

describe('The game', () => {
	beforeEach( () => {
		cy.fixture('signals.json').as('signals');
		cy.visit('http://localhost:3000');
		cy.waitFor('[data-question="true"]');
	});

	it('Counts score', function() {
		const SIGNALS = convertQuestions( this.signals );
		const $title = Cypress.$('[data-question="true"] title');
		const questionID = '#'+$title.attr('id').replace( '-title', '' );
		const answer = SIGNALS[ questionID ].text;

		const $wrong = Cypress.$(`[data-answer]:not(:contains(${ answer })):first`);
		cy.wrap( $wrong ).click();
		cy.get('[data-score]').should('contain', '-1');
		cy.get('[data-answer]').contains( answer ).click();
		cy.get('[data-score]').should('contain', '0');
		cy.get('[data-next]').should('be.visible');
	});
});
