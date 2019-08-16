function convertQuestions( questions ) {
	const newQuestions = {};
	questions.map( question => {
		newQuestions[ question.image ] = question;
	});
	return newQuestions;
}

// fixing beforeunload bug in cypress https://github.com/cypress-io/cypress/issues/2118
Cypress.on('window:load', function(window) {
	const original = window.addEventListener;
	window.addEventListener = function() {
		if (arguments && arguments[0] === 'beforeunload') {
			return;
		}
		return original.apply(this, arguments);
	};
});

describe('The game', () => {
	before( () => {
		cy.fixture('signals.json').as('signals');
	});

	beforeEach( () => {
		cy.visit('http://localhost:3000');
		cy.waitFor('[data-question="true"]');
		cy.window().then( win => win.onbeforeunload = undefined );
	});

	it('Counts score', function() {
		const SIGNALS = convertQuestions( this.signals );
		const $title = Cypress.$('[data-question="true"] title');
		const questionID = '#'+$title.attr('id').replace( '-title', '' );
		const answer = SIGNALS[ questionID ].text;

		const $wrong = Cypress.$(`[data-answer]:not(:contains(${ answer }))`);
		cy.wrap( $wrong.eq( 0 ) ).click();
		cy.get('[data-score]').should('contain', '-1');
		cy.wrap( $wrong.eq( 1 ) ).click();
		cy.get('[data-score]').should('contain', '-2');
		cy.get('[data-answer]').contains( answer ).click();
		cy.get('[data-score]').should('contain', '-1');
		cy.get('[data-next]').should('be.visible');

		// cy.reload();
	});
});
