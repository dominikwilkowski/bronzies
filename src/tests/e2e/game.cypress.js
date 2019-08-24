/**
 * Convert a question array into an object where the image becomes the key
 *
 * @param  {array}  questions - An array of question objects
 *
 * @return {object}           - An object with all the original objects but with the image as key for each
 */
function convertQuestions( questions ) {
	const newQuestions = {};
	questions.map( question => {
		newQuestions[ question.image ] = question;
	});
	return newQuestions;
}

// fixing beforeunload bug in cypress https://github.com/cypress-io/cypress/issues/2118
Cypress.on('window:load', window => {
	const original = window.addEventListener;
	window.addEventListener = () => {
		if( arguments && arguments[ 0 ] === 'beforeunload' ) {
			return;
		}
		return original.apply( this, arguments );
	};
});

describe('The game', () => {
	beforeEach( () => {
		cy.fixture('signals-staging.json').as('signals');
		cy.visit('http://localhost:3000');
	});

	it('should count score and rounds in image2text mode', function() {
		const SIGNALS = convertQuestions( this.signals );
		const SIGNALLENGTH = this.signals.length;
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
			.get('[data-round]').should( 'contain', '1' )
			// we check that all remaining progress steps display in future state and that all are there
			.get('[data-progress-status]').should( $p => {
				expect( $p ).to.have.length( SIGNALLENGTH );
				expect( Cypress.$( $p[ 0 ] ).attr('data-progress-status') ).to.deep.eq('current');

				const rest = [ ...new Array( SIGNALLENGTH ) ].map( ( _, item ) => Cypress.$( $p[ item ] ).attr('data-progress-status') );
				expect( rest ).to.deep.eq( [ 'current', ...new Array( SIGNALLENGTH - 1 ).fill('future') ] );
			})
			// first we go through an entire round programmatically
			.wrap( new Array( SIGNALLENGTH ) )
			.each( () => {
				cy
					// we get what the question is and store what the right and wrong answers are
					.wrap( null ).then( () => {
						$title = Cypress.$('[data-question="true"] title');
						questionID = '#'+$title.attr('id').replace( '-title', '' );
						answerText = SIGNALS[ questionID ].text;
						correct = new RegExp(`^(${ answerText })$`, 'g');
						wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
					})
					// we check the progress bar
					.get('[data-progress-status]').should( $p => {
						expect( $p ).to.have.length( SIGNALLENGTH );
						expect( Cypress.$( $p[ position ] ).attr('data-progress-status') ).to.deep.eq('current');
						if( position > 0 ) {
							expect( Cypress.$( $p[ position - 1 ] ).attr('data-progress-status') ).to.deep.eq('wrong');
						}
					})
					// we click the wrong answer
					.wrap( null ).then( () => {
						cy.get('[data-answer=""]').contains( wrongs, { timeout: 60000 } ).click();
					})
					// check the score has now one less
					.wrap( null ).then( () => {
						score --;
						cy.get('[data-score]').should( 'contain', score );
					})
					// click another wrong answer
					.wrap( null ).then( () => {
						cy.get('[data-answer=""]').contains( wrongs ).click();
					})
					// again score should have subtracted
					.wrap( null ).then( () => {
						score --;
						cy.get('[data-score]').should( 'contain', score );
					})
					// now we select the right answer
					.wrap( null ).then( () => {
						cy.get('[data-answer]').contains( correct ).click();
					})
					// score now has one more point
					.wrap( null ).then( () => {
						score ++;
						cy.get('[data-score]').should( 'contain', score );
					})
					// check that inputs are disabled
					.get('[data-next]').should('be.visible')
					.get('[data-answer]').should('be.disabled')
					.get('[data-game-toggle]').should('be.disabled')
					.get('[data-round-toggle]').should('be.disabled')
					.getAllByText('Next question ⇢').filter(':not(:visible)').should('not.be.visible')
					// now we click to go to the next question
					.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
					// let's make sure the score is still the same
					.wrap( null ).then( () => {
						cy.get('[data-score]').should( 'contain', score );
					})
					// all inputs are clickable again
					.get('[data-answer]').should('not.be.disabled')
					.get('[data-game-toggle]').should('not.be.disabled')
					.get('[data-round-toggle]').should('not.be.disabled')
					// this is where we iterate on the position for the next question
					.wrap( null ).then( () => {
						position ++;
				});
			})
			// now that we have completed a round, let's check that it's also displayed
			.get('[data-round]').should( 'contain', '2' )
			// getting our questions and answers again
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
			// check the status bar which has now been restarted for the new round
			.get('[data-progress-status]').should( $p => {
				position = 0;
				expect( $p ).to.have.length( SIGNALLENGTH );
				expect( Cypress.$( $p[ position ] ).attr('data-progress-status') ).to.deep.eq('current');
				const rest = [ ...new Array( SIGNALLENGTH - position ) ].map( ( _, item ) => Cypress.$( $p[ item + position ] ).attr('data-progress-status') );
				expect( rest ).to.deep.eq( [ 'current', ...new Array( SIGNALLENGTH - position - 1 ).fill('future') ] );
			})
			// now let's select the correct answer right away
			.wrap( null ).then( () => {
				cy.get('[data-answer]').contains( correct ).click();
			})
			// we should have more score
			.wrap( null ).then( () => {
				score ++;
				cy.get('[data-score]').should( 'contain', score );
			})
			// check the visibility and disable state
			.get('[data-next]').should('be.visible')
			.get('[data-answer]').should('be.disabled')
			.get('[data-game-toggle]').should('be.disabled')
			.get('[data-round-toggle]').should('be.disabled')
			.getAllByText('Next question ⇢').filter(':not(:visible)').should('not.be.visible')
			.wait( 400 )
			.getAllByText('Next question ⇢').filter(':visible').click()
			.wrap( null ).then( () => {
				cy.get('[data-score]').should( 'contain', score );
			})
			.get('[data-answer]').should('not.be.disabled')
			.get('[data-game-toggle]').should('not.be.disabled')
			.get('[data-round-toggle]').should('not.be.disabled')
			// now that we have answered the last question correctly it should be marked as such
			.get('[data-progress-status]').should( $p => {
				position ++;
				expect( $p ).to.have.length( SIGNALLENGTH );
				expect( Cypress.$( $p[ position ] ).attr('data-progress-status') ).to.deep.eq('current');
				expect( Cypress.$( $p[ 0 ] ).attr('data-progress-status') ).to.deep.eq('right');
			})
	});

	it('should count score and rounds in text2image mode', function() {
		const SIGNALS = convertQuestions( this.signals );
		const QUESTIONS = this.signals;
		const SIGNALLENGTH = this.signals.length;
		// some hoisting of variables so our (fake) promises have access to them
		let $title;
		let questionID;
		let answerText;
		let score = 0;
		let position = 0;

		cy
			.waitFor('[data-question="true"]')
			.get('[data-round]').should( 'contain', '1' )
			// we check that all remaining progress steps display in future state and that all are there
			.get('[data-progress-status]').should( $p => {
				expect( $p ).to.have.length( SIGNALLENGTH );
				expect( Cypress.$( $p[ 0 ] ).attr('data-progress-status') ).to.deep.eq('current');

				const rest = [ ...new Array( SIGNALLENGTH ) ].map( ( _, item ) => Cypress.$( $p[ item ] ).attr('data-progress-status') );
				expect( rest ).to.deep.eq( [ 'current', ...new Array( SIGNALLENGTH - 1 ).fill('future') ] );
			})
			.get('[data-game-toggle-label]').click()
			// first we go through an entire round programmatically
			.wrap( new Array( SIGNALLENGTH ) )
			.each( () => {
				cy
					// we get what the question is and store what the right and wrong answers are
					.wrap( null ).then( () => {
						$title = Cypress.$('[data-question="true"] span');
						const questionImageID = $title.text();
						answerText = QUESTIONS.find( question => question.text === questionImageID ).image;
					})
					// we check the progress bar
					.get('[data-progress-status]').should( $p => {
						expect( $p ).to.have.length( SIGNALLENGTH );
						expect( Cypress.$( $p[ position ] ).attr('data-progress-status') ).to.deep.eq('current');
						if( position > 0 ) {
							expect( Cypress.$( $p[ position - 1 ] ).attr('data-progress-status') ).to.deep.eq('wrong');
						}
					})
					// we click the wrong answer
					.wrap( null ).then( () => {
						cy.get(`[data-answer=""] [data-id]:not([data-id="${ answerText }"])`, { timeout: 60000 }).eq( 0 ).click();
					})
					// check the score has now one less
					.wrap( null ).then( () => {
						score --;
						cy.get('[data-score]').should( 'contain', score );
					})
					// click another wrong answer
					.wrap( null ).then( () => {
						cy.get(`[data-answer=""] [data-id]:not([data-id="${ answerText }"])`).eq( 1 ).click();
					})
					// again score should have subtracted
					.wrap( null ).then( () => {
						score --;
						cy.get('[data-score]').should( 'contain', score );
					})
					// now we select the right answer
					.wrap( null ).then( () => {
						cy.get(`[data-answer=""] [data-id="${ answerText }"]`).click();
					})
					// score now has one more point
					.wrap( null ).then( () => {
						score ++;
						cy.get('[data-score]').should( 'contain', score );
					})
					// check that inputs are disabled
					.get('[data-next]').should('be.visible')
					.get('[data-answer]').should('be.disabled')
					.get('[data-game-toggle]').should('be.disabled')
					.get('[data-round-toggle]').should('be.disabled')
					.getAllByText('Next question ⇢').filter(':not(:visible)').should('not.be.visible')
					// now we click to go to the next question
					.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
					// let's make sure the score is still the same
					.wrap( null ).then( () => {
						cy.get('[data-score]').should( 'contain', score );
					})
					// all inputs are clickable again
					.get('[data-answer]').should('not.be.disabled')
					.get('[data-game-toggle]').should('not.be.disabled')
					.get('[data-round-toggle]').should('not.be.disabled')
					// this is where we iterate on the position for the next question
					.wrap( null ).then( () => {
						position ++;
				});
			})
			// now that we have completed a round, let's check that it's also displayed
			.get('[data-round]').should( 'contain', '2' )
			// getting our questions and answers again
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] span');
				const questionImageID = $title.text();
				answerText = QUESTIONS.find( question => question.text === questionImageID ).image;
			})
			// check the status bar which has now been restarted for the new round
			.get('[data-progress-status]').should( $p => {
				position = 0;
				expect( $p ).to.have.length( SIGNALLENGTH );
				expect( Cypress.$( $p[ position ] ).attr('data-progress-status') ).to.deep.eq('current');
				const rest = [ ...new Array( SIGNALLENGTH - position ) ].map( ( _, item ) => Cypress.$( $p[ item + position ] ).attr('data-progress-status') );
				expect( rest ).to.deep.eq( [ 'current', ...new Array( SIGNALLENGTH - position - 1 ).fill('future') ] );
			})
			// now let's select the correct answer right away
			.wrap( null ).then( () => {
				cy.get(`[data-answer=""] [data-id="${ answerText }"]`).click();
			})
			// we should have more score
			.wrap( null ).then( () => {
				score ++;
				cy.get('[data-score]').should( 'contain', score );
			})
			// check the visibility and disable state
			.get('[data-next]').should('be.visible')
			.get('[data-answer]').should('be.disabled')
			.get('[data-game-toggle]').should('be.disabled')
			.get('[data-round-toggle]').should('be.disabled')
			.getAllByText('Next question ⇢').filter(':not(:visible)').should('not.be.visible')
			.wait( 400 )
			.getAllByText('Next question ⇢').filter(':visible').click()
			.wrap( null ).then( () => {
				cy.get('[data-score]').should( 'contain', score );
			})
			.get('[data-answer]').should('not.be.disabled')
			.get('[data-game-toggle]').should('not.be.disabled')
			.get('[data-round-toggle]').should('not.be.disabled')
			// now that we have answered the last question correctly it should be marked as such
			.get('[data-progress-status]').should( $p => {
				position ++;
				expect( $p ).to.have.length( SIGNALLENGTH );
				expect( Cypress.$( $p[ position ] ).attr('data-progress-status') ).to.deep.eq('current');
				expect( Cypress.$( $p[ 0 ] ).attr('data-progress-status') ).to.deep.eq('right');
			})
	});

	it('should keep track of your wrong answers', function() {
		const SIGNALS = convertQuestions( this.signals );
		const QUESTIONS = this.signals;
		const SIGNALLENGTH = this.signals.length;
		let $title;
		let questionID;
		let answerText;
		let correct;
		let wrongs;
		const history = [];
		let uniqeHistory;

		cy
			.waitFor('[data-question="true"]')
			.get('[data-round]').should( 'contain', '1' )
			.get('[data-round-toggle]').should('be.disabled')
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				history.push( questionID.substr( 1 ) );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).click();
			})
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).click();
			})
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).click();
			})
			.wrap( null ).then( () => {
				cy.get('[data-answer]').contains( correct ).click();
			})
			.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
			.wrap( null ).then( () => {
				cy.get('[data-answer]').contains( correct ).click();
			})
			.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				history.push( questionID.substr( 1 ) );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).click();
			})
			.wrap( null ).then( () => {
				cy.get('[data-answer]').contains( correct ).click();
			})
			.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				history.push( questionID.substr( 1 ) );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).click();
			})
			.get('[data-game-toggle-label]').click()
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] span');
				const questionImageID = $title.text();
				answerText = QUESTIONS.find( question => question.text === questionImageID ).image;
				history.push( answerText.substr( 1 ) );
			})
			.wrap( null ).then( () => {
				cy.get(`[data-answer=""] [data-id]:not([data-id="${ answerText }"])`).eq( 0 ).click();
			})
			.wrap( null ).then( () => {
				cy.get(`[data-answer=""] [data-id="${ answerText }"]`).click();
			})
			.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] span');
				const questionImageID = $title.text();
				answerText = QUESTIONS.find( question => question.text === questionImageID ).image;
			})
			.wrap( null ).then( () => {
				cy.get(`[data-answer=""] [data-id="${ answerText }"]`).click();
			})
			.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
			.get('[data-round-toggle]').click()
			.get('[data-round-toggle-popup]').then( $item => {
				uniqeHistory = [ ... new Set( history ) ];
				expect( $item, 'text content' ).to.contain.text(`wrong so far (${ uniqeHistory.length })`);
			})
			.get('button').contains('Practice').click()
			.get('[data-round-toggle]').should( 'contain', 'Practice' )
			.wrap( null ).then( () => {
				cy
					.wrap( uniqeHistory )
					.each( () => {
						cy
							.wrap( null ).then( () => {
								$title = Cypress.$('[data-question="true"] span');
								const questionImageID = $title.text();
								answerText = QUESTIONS.find( question => question.text === questionImageID ).image;
								expect( uniqeHistory.includes( answerText.substr( 1 ) ) ).to.be.true;
							})
							.wrap( null ).then( () => {
								cy.get(`[data-answer=""] [data-id="${ answerText }"]`).click();
							})
							.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
					})
					.get('[data-round]').should( 'contain', '2' )
					.get('[data-game-toggle-label]').click()
					.get('[data-round]').should( 'contain', '2' )
					.wrap( uniqeHistory )
					.each( () => {
						cy
							.wrap( null ).then( () => {
								$title = Cypress.$('[data-question="true"] title');
								questionID = '#'+$title.attr('id').replace( '-title', '' );
								answerText = SIGNALS[ questionID ].text;
								correct = new RegExp(`^(${ answerText })$`, 'g');
								expect( uniqeHistory.includes( questionID.substr( 1 ) ) ).to.be.true;
							})
							.wrap( null ).then( () => {
								cy.get('[data-answer]').contains( correct ).click();
							})
							.getAllByText('Next question ⇢', { timeout: 60000 }).filter(':visible').click()
					})
					.get('[data-round]').should( 'contain', '3' )
			});
	});
});
