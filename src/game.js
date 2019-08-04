/** @jsx jsx */
import useRemoteData from './useRemoteData';
import { Link } from '@reach/router';
import { useGameData } from './app';
import { jsx } from '@emotion/core';
import { useEffect } from 'react';
import GameBody from './gameBody';
import Progress from './progress';
import { colors } from './theme';
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
 * @param  {function} shuffleDeck - A shuffle function, default: shuffle
 * @param  {Integer}  limit       - The limit of items to be returned, default: 4
 *
 * @return {array}                - A subset of the input array, shuffled and including the `current` item
 */
export function getNewAnswers( current, deck, shuffleDeck = shuffle, limit = 4 ) {
	let newCards = [
		...shuffleDeck(
			deck.filter( question => question.image !== current.image )
		).slice( 0, limit ),
		current,
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
 * The main game where we pull each components together and store all the state we need for each game mode
 */
function Game() {
	const {
		questionsDB, setQuestionsDB,
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
		history, setHistory,
		score, setScore,
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
	function handleNextQuestion( questions, setQuestions, index, setIndex, rounds, setRounds, setCorrect, setChoices ) {
		setCorrect( false );

		let newIndex = index;
		if( index === questions.length - 1 ) {
			setQuestions( shuffle( questionsDB ) ); // we only take the questionsDB on new round to not disrupt the round mid-way
			setRounds( rounds + 1 );
			setIndex( 0 );
		}
		else {
			newIndex ++;
			setIndex( newIndex );
		}
		const newChoices = getNewAnswers( questions[ newIndex ], questions );
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

		if( questions[ index ].image === userAnswer ) {
			setChoices( tagAnswer( choices, userAnswer, 'status', 'correct' ) );
			setQuestions( tagAnswer( questions, questions[ index ].image, 'correct', true ) );
			setCorrect( true );
			setScore( score + 1 );
		}
		else {
			setChoices( tagAnswer( choices, userAnswer, 'status', 'wrong' ) );
			setQuestions( tagAnswer( questions, questions[ index ].image, 'correct', false ) );
			history[ questions[ index ].image ] = history[ questions[ index ].image ] ? history[ questions[ index ].image ] + 1 : 1;
			setHistory( history );
			setCorrect( false );
			setScore( score - 1 );
		}

		setUserAnswer('');
	};

	// now let's get the latest from the server
	const { data, loadingState } = useRemoteData('/api/questions');
	useEffect( () => {
		if( loadingState === 'loaded' ) {
			setQuestionsDB( data );
			localStorage.setItem( 'questions', JSON.stringify( data ) );

			if( wasNoLocalStorage ) {
				const newQuestionsImage = shuffle( data );
				setQuestionsImage( newQuestionsImage );
				setChoicesImage( getNewAnswers( newQuestionsImage[ 0 ], newQuestionsImage ) );
				setCorrectImage( false );
				setUserAnswerImage( '' );

				const newQuestionsText = shuffle( data );
				setQuestionsText( newQuestionsText );
				setChoicesText( getNewAnswers( newQuestionsText[ 0 ], newQuestionsText ) );
				setCorrectText( false );
				setUserAnswerText( '' );
			}
		}
	}, [
		data,
		loadingState,
		setChoicesImage,
		setChoicesText,
		setCorrectImage,
		setCorrectText,
		setQuestionsDB,
		setQuestionsImage,
		setQuestionsText,
		setUserAnswerImage,
		setUserAnswerText,
		wasNoLocalStorage
	]);

	/**
	 * =~=~=~=~=~=~=~=~=~=
	 */
	return (
		<main>
			<Loading data={ questionsDB } loadingState={ loadingState }>
				<div css={{
					overflow: 'hidden',
				}}>
					<label css={{
						display: 'inline-block',
						position: 'relative',
						float: 'left',
						padding: '18px 0',
						marginLeft: '0.5rem',
						width: '50px',
						height: '12px',
						verticalAlign: 'middle',
						':before': {
							content: '""',
							position: 'absolute',
							display: 'inline-block',
							borderRadius: '20px',
							background: '#fff',
							border: '#999 1px solid',
							height: '12px',
							width: '50px',
							top: '12px',
							left: 0,
						},
						':hover': {
							cursor: 'pointer',
						}
					}}>
						<input
							css={{
								opacity: 0,
							}}
							type='checkbox'
							onChange={ () => setQuestionAsImage( !questionAsImage ) }
							disabled={ questionAsImage ? correctImage : correctText }
							checked={ questionAsImage }
						/>
						<span css={{
							display: 'block',
							width: '1px',
							height: '1px',
							padding: 0,
							margin: '-1px',
							overflow: 'hidden',
							clip: 'rect(0,0,0,0)',
							border: '0',
							textIndent: '-999999em',
							':after': {
								content: '""',
								position: 'absolute',
								display: 'inline-block',
								top: '6px',
								left: '26px',
								width: '24px',
								height: '24px',
								borderRadius: '50%',
								background: questionAsImage ? colors[ 0 ] : colors[ 1 ],
								border: '#333 1px solid',
								transition: 'left 0.3s ease, background 0.3s ease',
								'input:checked + &': {
									left: '0',
								},
							},
						}}>Toggle game mode</span>
					</label>
					<div css={{
						display: 'grid',
						alignContent: 'center',
						float: 'right',
						height: '36px',
						marginRight: '0.5rem',
					}}>
						<Link to='/highscore'>Score board</Link>
					</div>
				</div>
				<Progress
					questions={ questionAsImage ? questionsImage : questionsText }
					current={ questionAsImage ? indexImage : indexText }
				/>
				<GameBody
					questions={ questionAsImage ? questionsImage : questionsText }
					setQuestions={ questionAsImage ? setQuestionsImage : setQuestionsText }
					index={ questionAsImage ? indexImage : indexText }
					setIndex={ questionAsImage ? setIndexImage : setIndexText }
					choices={ questionAsImage ? choicesImage : choicesText }
					setChoices={ questionAsImage ? setChoicesImage : setChoicesText }
					correct={ questionAsImage ? correctImage : correctText }
					setCorrect={ questionAsImage ? setCorrectImage : setCorrectText }
					userAnswer={ questionAsImage ? userAnswerImage : userAnswerText }
					setUserAnswer={ questionAsImage ? setUserAnswerImage : setUserAnswerText }
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
