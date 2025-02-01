import { convertQuestions } from '../../../server/utils.js';

function escapeRegex(str = '') {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('The game', () => {
	beforeEach( () => {
		cy.fixture('signals-staging.json').as('signals');
		cy.visit('http://localhost:3000');
	});

	it('should count score and rounds in image2text mode', function() {
		// getting data from our fixtures
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
				cy.log(`========== ${position} ==========`);
				cy.get('[data-question="true"] title')
					// we get what the question is and store what the right and wrong answers are
					.then((title) => {
						$title = title;
						const idAttr = $title.attr('id');
						questionID = '#' + idAttr.replace('-title', '');
						answerText = SIGNALS[questionID].text;

						const safeAnswer = escapeRegex(SIGNALS[questionID].text);
						wrongs = new RegExp(`^(?!${safeAnswer}$).*$`);
						correct = new RegExp(`^${safeAnswer}$`);
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
					.then(() => {
						score --;
						cy.contains('button[data-answer=""]', wrongs).realClick()
						// check the score has now one less
						.get('[data-score]').should( 'contain', score )
						// check that there is no "Next Question" button visible
						.get('button[data-cy-id="Next question"]').should( 'not.be.visible' );
					})
					// we click the wrong answer
					.then(() => {
						score --;
						cy.contains('button[data-answer=""]', wrongs).realClick()
						// check the score has now one less
						.get('[data-score]').should( 'contain', score )
						// check that there is no "Next Question" button visible
						.get('button[data-cy-id="Next question"]').should( 'not.be.visible' );
					})
					.then(() => {
						cy.contains('button[data-answer]', correct).each($btn => {
							cy.log($btn.text());
						})
					})
					// we click the right answer
					.then(() => {
						score ++;
						cy.contains('button[data-answer]', correct).realClick().then(() => {
							cy
								// check the score has now one more
								.get('[data-score]').should( 'contain', score )
								// check that there is no "Next Question" button visible
								.get('[data-next]').should('be.visible')
								.get('[data-answer]').should('be.disabled')
								.get('[data-game-toggle]').should('be.disabled')
								.get('[data-round-toggle]').should('be.disabled')
								// now we click to go to the next question
								.get('button[data-cy-id="Next question"]').filter(':visible').realClick()
								// let's make sure the score is still the same
								.get('[data-score]').should( 'contain', score )
								.get('[data-answer]').should('not.be.disabled')
								.get('[data-game-toggle]').should('not.be.disabled')
								.get('[data-round-toggle]').should('not.be.disabled');
						})
					})
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
				cy.get('[data-answer]').contains( correct ).realClick();
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
			.get('button[data-cy-id="Next question"]').filter(':not(:visible)').should('not.be.visible')
			.wait( 400 )
			.get('button[data-cy-id="Next question"]').filter(':visible').realClick()
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
		// getting data from our fixtures
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
			.get('[data-round]').should( 'contain', '1' )
			// we check that all remaining progress steps display in future state and that all are there
			.get('[data-progress-status]').should( $p => {
				expect( $p ).to.have.length( SIGNALLENGTH );
				expect( Cypress.$( $p[ 0 ] ).attr('data-progress-status') ).to.deep.eq('current');

				const rest = [ ...new Array( SIGNALLENGTH ) ].map( ( _, item ) => Cypress.$( $p[ item ] ).attr('data-progress-status') );
				expect( rest ).to.deep.eq( [ 'current', ...new Array( SIGNALLENGTH - 1 ).fill('future') ] );
			})
			.get('[data-game-toggle-label]').realClick()
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
						cy.get(`[data-answer=""] [data-id]:not([data-id="${ answerText }"])`, { timeout: 60000 }).eq( 0 ).realClick();
					})
					// check the score has now one less
					.wrap( null ).then( () => {
						score --;
						cy.get('[data-score]').should( 'contain', score );
					})
					// check that there is no "Next Question" button visible
					.get('button[data-cy-id="Next question"]').should( 'not.be.visible' )
					// click another wrong answer
					.wrap( null ).then( () => {
						cy.get(`[data-answer=""] [data-id]:not([data-id="${ answerText }"])`).eq( 1 ).realClick();
					})
					// again score should have subtracted
					.wrap( null ).then( () => {
						score --;
						cy.get('[data-score]').should( 'contain', score );
					})
					// check that there is no "Next Question" button visible
					.get('button[data-cy-id="Next question"]').should( 'not.be.visible' )
					// now we select the right answer
					.wrap( null ).then( () => {
						cy.get(`[data-answer=""] [data-id="${ answerText }"]`).realClick();
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
					.get('button[data-cy-id="Next question"]').filter(':not(:visible)').should('not.be.visible')
					// now we click to go to the next question
					.get('button[data-cy-id="Next question"]', { timeout: 60000 }).filter(':visible').realClick()
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
				cy.get(`[data-answer=""] [data-id="${ answerText }"]`).realClick();
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
			.get('button[data-cy-id="Next question"]').filter(':not(:visible)').should('not.be.visible')
			.wait( 400 )
			.get('button[data-cy-id="Next question"]').filter(':visible').realClick()
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
		// getting data from our fixtures
		const SIGNALS = convertQuestions( this.signals );
		const QUESTIONS = this.signals;
		const SIGNALLENGTH = this.signals.length;
		// some hoisting of variables so our (fake) promises have access to them
		let $title;
		let questionID;
		let answerText;
		let correct;
		let wrongs;
		const history = [];
		let uniqeHistory;

		cy
			.get('[data-round]').should( 'contain', '1' )
			.get('[data-round-toggle]').should('be.disabled')
			// getting the current question from the DOM
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				history.push( questionID.substr( 1 ) );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
			// wrong answer
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).realClick();
			})
			// wrong answer
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).realClick();
			})
			// wrong answer
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).realClick();
			})
			// correct answer
			.wrap( null ).then( () => {
				cy.get('[data-answer]').contains( correct ).realClick();
			})
			// next question
			.get('button[data-cy-id="Next question"]', { timeout: 60000 }).filter(':visible').realClick()
			// getting the current question from the DOM
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
			// correct answer
			.wrap( null ).then( () => {
				cy.get('[data-answer]').contains( correct ).realClick();
			})
			// next question
			.get('button[data-cy-id="Next question"]', { timeout: 60000 }).filter(':visible').realClick()
			// getting the current question from the DOM
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				history.push( questionID.substr( 1 ) );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
			// wrong answer
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).realClick();
			})
			// correct answer
			.wrap( null ).then( () => {
				cy.get('[data-answer]').contains( correct ).realClick();
			})
			// correct question
			.get('button[data-cy-id="Next question"]', { timeout: 60000 }).filter(':visible').realClick()
			// getting the current question from the DOM
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] title');
				questionID = '#'+$title.attr('id').replace( '-title', '' );
				history.push( questionID.substr( 1 ) );
				answerText = SIGNALS[ questionID ].text;
				correct = new RegExp(`^(${ answerText })$`, 'g');
				wrongs = new RegExp(`^(?!${ answerText }$).*$`, 'gm');
			})
			// wrong answer
			.wrap( null ).then( () => {
				cy.get('[data-answer=""]').contains( wrongs ).realClick();
			})
			// toggle to text2image mode
			.get('[data-game-toggle-label]').realClick()
			// getting the current question from the DOM
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] span');
				const questionImageID = $title.text();
				answerText = QUESTIONS.find( question => question.text === questionImageID ).image;
				history.push( answerText.substr( 1 ) );
			})
			// wrong answer
			.wrap( null ).then( () => {
				cy.get(`[data-answer=""] [data-id]:not([data-id="${ answerText }"])`).eq( 0 ).realClick();
			})
			// correct answer
			.wrap( null ).then( () => {
				cy.get(`[data-answer=""] [data-id="${ answerText }"]`).realClick();
			})
			// next question
			.get('button[data-cy-id="Next question"]', { timeout: 60000 }).filter(':visible').realClick()
			// getting the current question from the DOM
			.wrap( null ).then( () => {
				$title = Cypress.$('[data-question="true"] span');
				const questionImageID = $title.text();
				answerText = QUESTIONS.find( question => question.text === questionImageID ).image;
			})
			// correct answer
			.wrap( null ).then( () => {
				cy.get(`[data-answer=""] [data-id="${ answerText }"]`).realClick();
			})
			// next question
			.get('button[data-cy-id="Next question"]', { timeout: 60000 }).filter(':visible').realClick()
			.get('[data-round-toggle]').should( 'contain', 'Signals' )
			// go into round toggle
			.get('[data-round-toggle]').realClick()
			.get('[data-round-toggle-popup]').then( $item => {
				uniqeHistory = [ ... new Set( history ) ];
				expect( $item, 'text content' ).to.contain.text(`wrong so far (${ uniqeHistory.length })`);
			})
			// choose practice round
			.get('button').contains('Practice').realClick()
			.get('[data-round-toggle]').should( 'contain', 'Practice' )
			// now we iterate over all questions we answered wrong and check that they are all there
			.wrap( null ).then( () => {
				cy
					.wrap( uniqeHistory )
					.each( () => {
						cy
							// getting the current question from the DOM
							.wrap( null ).then( () => {
								$title = Cypress.$('[data-question="true"] span');
								const questionImageID = $title.text();
								answerText = QUESTIONS.find( question => question.text === questionImageID ).image;
								expect( uniqeHistory.includes( answerText.substr( 1 ) ) ).to.be.true;
							})
							// correct answer
							.wrap( null ).then( () => {
								cy.get(`[data-answer=""] [data-id="${ answerText }"]`).realClick();
							})
							// next question
							.get('button[data-cy-id="Next question"]', { timeout: 60000 }).filter(':visible').realClick()
					})
					.get('[data-round]').should( 'contain', '2' )
					// let's go back to image2text mode
					.get('[data-game-toggle-label]').realClick()
					.get('[data-round]').should( 'contain', '2' )
					.wrap( uniqeHistory )
					// now we check again that all questions we answered wrong earlier are in this round
					.each( () => {
						cy
							// getting the current question from the DOM
							.wrap( null ).then( () => {
								$title = Cypress.$('[data-question="true"] title');
								questionID = '#'+$title.attr('id').replace( '-title', '' );
								answerText = SIGNALS[ questionID ].text;
								correct = new RegExp(`^(${ answerText })$`, 'g');
								expect( uniqeHistory.includes( questionID.substr( 1 ) ) ).to.be.true;
							})
							// correct answer
							.wrap( null ).then( () => {
								cy.get('[data-answer]').contains( correct ).realClick();
							})
							// next question
							.get('button[data-cy-id="Next question"]', { timeout: 60000 }).filter(':visible').realClick()
					})
					.get('[data-round]').should( 'contain', '3' )
			});
	});
});
