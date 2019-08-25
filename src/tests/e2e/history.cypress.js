import { convertQuestions } from '../../../server/utils.js';

describe('The history', () => {
	beforeEach( () => {
		cy.fixture('highscore-staging.json').as('highscore');
		cy.fixture('signals-staging.json').as('signals');
		cy.visit('http://localhost:3000');
	});

	it('should count score and rounds in image2text mode', function() {
		// getting data from our fixtures
		const SIGNALS = convertQuestions( this.signals );
		const HIGHSCORE = this.highscore;
		// some hoisting of variables so our (fake) promises have access to them
		let $title;
		let questionID;
		let answerText;
		let correct;
		let wrongs;
		let score = 0;
		let position = 0;

		cy
			.waitFor('[data-question="true"]')
			// go into highscore
			.get('a').contains('Score').click()
			.waitFor('a[data-back-link]')
			// check that there are no user sections yet
			.get('p[data-most-wrong]').should('not.be.visible')
			.get('form[data-input-form]').should('not.be.visible')
			.root().should( 'contain', 'Latest entries' )
			.root().should( 'contain', `Total: ${ HIGHSCORE.length }` )
			.root().should( 'contain', 'Score board' )
			.root().should( 'contain', 'Top 50' )
			// go back to game
			.get('a').contains('Go back to the game').click()
			.waitFor('[data-question="true"]')
			// getting the current question from the DOM
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
			})
			// correct answer
			.wrap( null ).then( () => {
				cy.get('[data-answer]').contains( correct ).click();
			})
			// next question
			.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
			// go into highscore
			.get('a').contains('Score').click()
			.waitFor('a[data-back-link]')
			// check what's displayed
			.get('p[data-most-wrong]').should('not.be.visible')
			.get('form[data-input-form]').should('be.visible')
			.root().contains('pushups').should('not.be.visible')
			// go back to game
			.get('a').contains('Go back to the game').click()
			.waitFor('[data-question="true"]')
			// getting the current question from the DOM
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
			// wrong answer
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).click();
			})
			// go into highscore
			.get('a').contains('Score').click()
			.waitFor('a[data-back-link]')
			.get('p[data-most-wrong]').should('be.visible')
			.get('form[data-input-form]').should('be.visible')
			.root().contains('5 pushups').should('be.visible')
			// go back to game
			.get('a').contains('Go back to the game').click()
			.waitFor('[data-question="true"]')
			// correct answer
			.wrap( null ).then( () => {
				cy.get('[data-answer]').contains( correct ).click();
			})
			// next question
			.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
			// getting the current question from the DOM
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
	});
});
