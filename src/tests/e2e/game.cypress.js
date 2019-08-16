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
		cy.fixture('signals-staging.json').as('signals');
	});

	beforeEach( () => {
		cy.visit('http://localhost:3000');
		cy.waitFor('[data-question="true"]');
		cy.window().then( win => win.onbeforeunload = undefined );
	});

	it('should count score and work as expected', function() {
		const SIGNALS = convertQuestions( this.signals );
		const SIGNALLENGTH = this.signals.length;
		const $title = Cypress.$('[data-question="true"] title');
		const questionID = '#'+$title.attr('id').replace( '-title', '' );
		const answerText = SIGNALS[ questionID ].text;
		const correct = new RegExp(`^(${ answerText })$`, 'g');
		const wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');

		cy
			.get('[data-progress-status]').should( $p => {
				expect( $p ).to.have.length( SIGNALLENGTH );
				expect( Cypress.$( $p[ 0 ] ).attr('data-progress-status') ).to.deep.eq('current');
				const rest = [ ...new Array( SIGNALLENGTH - 1 ) ].map( ( _, item ) => Cypress.$( $p[ item + 1 ] ).attr('data-progress-status') );
				expect( rest ).to.deep.eq( new Array( SIGNALLENGTH - 1 ).fill('future') );
			})
			.get('[data-answer=""]').contains( wrongs ).click()
			.get('[data-score]').should('contain', '-1')
			.get('[data-answer=""]').contains( wrongs ).click()
			.get('[data-score]').should('contain', '-2')
			.get('[data-answer]').contains( correct ).click()
			.get('[data-score]').should('contain', '-1')
			.get('[data-next]').should('be.visible')
			.get('[data-answer]').should('be.disabled')
			.getAllByText('Next question ⇢').filter(':not(:visible)').should('not.be.visible')
			.getAllByText('Next question ⇢').filter(':visible').click()
			.get('[data-score]').should('contain', '-1')
			.get('[data-answer]').should('not.be.disabled')
			.get('[data-progress-status]').should( $p => {
				expect( Cypress.$( $p[ 0 ] ).attr('data-progress-status') ).to.deep.eq('wrong');
				expect( Cypress.$( $p[ 1 ] ).attr('data-progress-status') ).to.deep.eq('current');
				const rest = [ ...new Array( SIGNALLENGTH - 2 ) ].map( ( _, item ) => Cypress.$( $p[ item + 2 ] ).attr('data-progress-status') );
				expect( rest ).to.deep.eq( new Array( SIGNALLENGTH - 2 ).fill('future') );
			})
	});
});
