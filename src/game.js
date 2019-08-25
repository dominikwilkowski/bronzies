/** @jsx jsx */
import { useEffect, useState } from 'react';
import useRemoteData from './useRemoteData';
import RoundToggle from './roundToggle';
import GameToggle from './gameToggle';
import { Link } from '@reach/router';
import { useGameData } from './app';
import { jsx } from '@emotion/core';
import GameBody from './gameBody';
import Progress from './progress';
import Loading from './loading';

/**
 * Simple Fisher–Yates shuffle function https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 *
 * @param  {array} array - An array to be shuffled
 *
 * @return {array}       - The shuffled array
 */
export function shuffle( array ) {
	const newArray = [ ...array ]; // cloning so we don't manipulate the input data
	let index = newArray.length;

	while( index ) {
		const randIndex = Math.floor( Math.random() * index-- );
		const value = newArray[ index ];

		newArray[ index ] = newArray[ randIndex ];
		newArray[ randIndex ] = value;
	}

	return newArray;
}

/**
 * A pure function (for testing) to pick a subset of random items from an array including a previously picked one
 *
 * @param  {object}   current     - The item that must be included
 * @param  {array}    deck        - An array of items
 * @param  {array}    db          - An array of all the questions
 * @param  {Integer}  limit       - The limit of items to be returned, default: 4
 * @param  {function} shuffleDeck - A shuffle function, default: shuffle
 *
 * @return {array}                - A subset of the input array, shuffled and including the `current` item
 */
export function getNewAnswers( current, deck, db = [], limit = 4, shuffleDeck = shuffle ) {
	const newDB = [ ...db ].filter( question => question.image !== current.image );
	deck = deck.filter( question => question.image !== current.image );

	if( deck.length < limit ) {
		deck = [
			...deck,
			...shuffleDeck(
				newDB.slice( 0, ( limit - deck.length ) )
			),
		];
	}

	let newCards = [
		current,
		...shuffleDeck( deck ).slice( 0, limit ),
	];

	return shuffleDeck( newCards );
}

/**
 * Given an array of objects, add a string to the `tagName` key of the item with the matching `image` key but only if it hasn't been set
 *
 * @param  {array}  answers - An array of objects in the shape [{ image: 'String1' },{ image: 'String2' }]
 * @param  {string} image   - A string that should match one of the items in the array
 * @param  {string} tagName - The name of the tag key
 * @param  {string} tag     - The tag to be added
 *
 * @return {array}          - The original array but with a new `tagName` key [{ image: 'String1' },{ image: 'String2', status: 'String' }]
 */
export function tagAnswer( answers, image, tagName, tag ) {
	return [ ...answers ].map( answer => {
		if( answer.image === image ) {
			return { [ tagName ]: tag, ...answer };
		}
		else {
			return answer;
		}
	});
};

/**
 * The beforeunload handler
 */
export function onUnload( event ) {
	event.returnValue = 'You still have unsaved score in your game, you will loose if you leave now.';
};

/**
 * The main game where we pull each components together and store all the state we need for each game mode
 */
function Game() {
	const {
		questionsDB,
		setQuestionsDB,
		svg, setSvg,
		signals, setSignals,
		questionsImage, setQuestionsImage,
		indexImage, setIndexImage,
		choicesImage, setChoicesImage,
		correctImage, setCorrectImage,
		userAnswerImage, setUserAnswerImage,
		questionsText, setQuestionsText,
		indexText, setIndexText,
		choicesText, setChoicesText,
		correctText, setCorrectText,
		userAnswerText, setUserAnswerText,
		questionAsImage, setQuestionAsImage,
		questionType,
		history, setHistory,
		wrongAnswers, setWrongAnswers,
		score, setScore,
		nays, setNays,
		rounds, setRounds,
		wasNoLocalStorage,
	} = useGameData();

	/**
	 * The user has found the right answer, let's now go to the next question
	 *
	 * @param  {array}    questions    - An array of question objects
	 * @param  {function} setQuestions - The state setter for questions
	 * @param  {integer}  index        - The current position we are at within the questions
	 * @param  {function} setIndex     - The state setter for index
	 * @param  {integer}  rounds       - The amount of rounds we have gone round about
	 * @param  {function} setRounds    - The state setter for rounds
	 * @param  {function} setCorrect   - The state setter for correct boolean
	 * @param  {function} setChoices   - The state setter for choices array
	 */
	function handleNextQuestion( questions, setQuestions, svgData, index, setIndex, rounds, setRounds, setCorrect, setChoices ) {
		setCorrect( false );

		let newIndex = index;
		let newQuestions = questions;
		if( index === questions.length - 1 ) {
			newIndex = 0;
			newQuestions = shuffle( questionsDB );
			setQuestions( newQuestions );
			setRounds( rounds + 1 );
			setIndex( newIndex );
			document
				.getElementById('svgSprite')
				.innerHTML = svgData;
		}
		else {
			newIndex ++;
			setIndex( newIndex );
		}
		const newChoices = getNewAnswers( newQuestions[ newIndex ], newQuestions, signals );
		setChoices( newChoices );
	};

	/**
	 * The user has chosen and we now figure out what to do
	 *
	 * @param  {object}   event         - The event object to prevent default
	 * @param  {array}    questions     - An array of question objects
	 * @param  {function} setQuestions  - The state setter for questions
	 * @param  {array}    choices       - An array of choices for this questions
	 * @param  {function} setChoices    - The state setter for choices
	 * @param  {integer}  index         - The current position we are at within the questions
	 * @param  {string}   userAnswer    - The answer the user has given (image part)
	 * @param  {function} setUserAnswer - The state setter for answers
	 * @param  {function} setCorrect    - The state setter for correct boolean
	 * @param  {function} tagAnswer     - A function to tag the answer within the questions array
	 * @param  {integer}  score         - The current score
	 */
	function handleAnswer( event, questions, setQuestions, choices, setChoices, index, userAnswer, setUserAnswer, setCorrect, tagAnswer, score ) {
		event.preventDefault();
		window.addEventListener( 'beforeunload', onUnload );
		history.push([ questionType, userAnswer, questions[ index ].text ]);
		setHistory( history );

		if( questions[ index ].image === userAnswer ) {
			setChoices( tagAnswer( choices, userAnswer, 'status', 'correct' ) );
			setQuestions( tagAnswer( questions, questions[ index ].image, 'correct', true ) );
			setCorrect( true );
			setScore( score + 1 );
		}
		else {
			setChoices( tagAnswer( choices, userAnswer, 'status', 'wrong' ) );
			setQuestions( tagAnswer( questions, questions[ index ].image, 'correct', false ) );
			wrongAnswers[ questions[ index ].image ] = wrongAnswers[ questions[ index ].image ] ? wrongAnswers[ questions[ index ].image ] + 1 : 1;
			setWrongAnswers( wrongAnswers );
			setCorrect( false );
			setScore( score - 1 );
			setNays( nays + 1 );
		}

		setUserAnswer('');
	};

	// now let's get the latest from the server
	const { data, loadingState: dataLoaded } = useRemoteData('/api/signals');
	const { data: svgData, loadingState: svgLoaded } = useRemoteData( '/api/assets/signals.svg', false );
	const [ loadingState, setLoadingState ] = useState( wasNoLocalStorage ? 'loading' : 'loaded' );

	useEffect( () => {
		if( wasNoLocalStorage ) {
			if( dataLoaded === 'stale' || svgLoaded === 'stale' ) {
				setLoadingState('stale');
			}
			if( dataLoaded === 'failed' || svgLoaded === 'failed' ) {
				setLoadingState('failed');
			}
			if( dataLoaded === 'loaded' && svgLoaded === 'loaded' ) {
				setLoadingState('loaded');
			}
		}

		if( dataLoaded === 'loaded' ) {
			localStorage.setItem( 'questions', JSON.stringify( data ) );
			setQuestionsDB( data );
			setSignals( data );

			if( wasNoLocalStorage ) {
				const newQuestionsImage = shuffle( data );
				setQuestionsImage( newQuestionsImage );
				setChoicesImage( getNewAnswers( newQuestionsImage[ 0 ], newQuestionsImage ) );
				setCorrectImage( false );
				setUserAnswerImage('');

				const newQuestionsText = shuffle( data );
				setQuestionsText( newQuestionsText );
				setChoicesText( getNewAnswers( newQuestionsText[ 0 ], newQuestionsText ) );
				setCorrectText( false );
				setUserAnswerText('');
			}
		}

		if( svgLoaded === 'loaded' ) {
			localStorage.setItem( 'svg', svgData );
			setSvg( svgData );
		}
	}, [
		data,
		dataLoaded,
		svg, setSvg, svgData,
		svgLoaded,
		loadingState,
		setChoicesImage,
		setChoicesText,
		setCorrectImage,
		setCorrectText,
		setQuestionsDB,
		setSignals,
		setQuestionsImage,
		setQuestionsText,
		setUserAnswerImage,
		setUserAnswerText,
		wasNoLocalStorage
	]);

	const gameState = questionAsImage ? 'questionAsImage' : 'questionAsText';
	const gameStates = {
		questionAsImage: {
			questions: questionsImage,
			current: indexImage,
			setQuestions: setQuestionsImage,
			index: indexImage,
			setIndex: setIndexImage,
			choices: choicesImage,
			setChoices: setChoicesImage,
			correct: correctImage,
			setCorrect: setCorrectImage,
			userAnswer: userAnswerImage,
			setUserAnswer: setUserAnswerImage,
		},
		questionAsText: {
			questions: questionsText,
			current: indexText,
			setQuestions: setQuestionsText,
			index: indexText,
			setIndex: setIndexText,
			choices: choicesText,
			setChoices: setChoicesText,
			correct: correctText,
			setCorrect: setCorrectText,
			userAnswer: userAnswerText,
			setUserAnswer: setUserAnswerText,
		}
	};

	/**
	 * =~=~=~=~=~=~=~=~=~=
	 */
	return (
		<main>
			<Loading loadingState={ loadingState }>
				<div css={{
					display: 'grid',
					gridTemplateColumns: '1fr auto 1fr',
				}}>
					<GameToggle isChecked={ questionAsImage } setIsChecked={ setQuestionAsImage } isDisabled={ gameStates[ gameState ].correct } />
					<div css={{
						display: 'grid',
						alignContent: 'center',
						height: '36px',
						marginRight: '0.5rem',
						textAlign: 'center',
					}}>
						<RoundToggle />
					</div>
					<div css={{
						display: 'grid',
						alignContent: 'center',
						textAlign: 'right',
						height: '36px',
						marginRight: '0.5rem',
					}}>
						<Link data-highscore to='/highscore'>Score&nbsp;board</Link>
					</div>
				</div>

				<Progress
					questions={ gameStates[ gameState ].questions }
					current={ gameStates[ gameState ].index }
				/>

				<GameBody
					questions={ gameStates[ gameState ].questions }
					setQuestions={ gameStates[ gameState ].setQuestions }
					index={ gameStates[ gameState ].index }
					setIndex={ gameStates[ gameState ].setIndex }
					choices={ gameStates[ gameState ].choices }
					setChoices={ gameStates[ gameState ].setChoices }
					correct={ gameStates[ gameState ].correct }
					setCorrect={ gameStates[ gameState ].setCorrect }
					userAnswer={ gameStates[ gameState ].userAnswer }
					setUserAnswer={ gameStates[ gameState ].setUserAnswer }
					questionAsImage={ questionAsImage }
					score={ score }
					rounds={ rounds }
					setRounds={ setRounds }
					handleNextQuestion={ handleNextQuestion }
					handleAnswer={ handleAnswer }
				/>
			</Loading>
		</main>
	);
};

Game.propTypes = {};

export default Game;
