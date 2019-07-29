/** @jsx jsx */
import { shuffle, useQuestions } from './app';
import ImageView from './imageView';
import { jsx } from '@emotion/core';
import TextView from './textView';
import Progress from './progress';
import { useState } from 'react';
import Choices from './choices';

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
 * Cleaning questions off tags from prior rounds
 *
 * @param  {array}  questions - An array of questions
 * @param  {string} tagName   - The name of the tag to be removed
 *
 * @return {array}            - A new array without the tags
 */
export function cleanTags( questions, tagName ) {
	return [ ...questions ].map( answer => {
		delete answer[ tagName ];
		return answer;
	});
};

// The main game where we pull each components together
function Main() {
	let [ score, setScore ] = useState( 0 );
	let [ game, setgameRounds ] = useState( 0 );
	let [ rounds, setRounds ] = useState( 1 );
	const [ correct, setCorrect ] = useState( false );
	let [ questionAsImage, setQuestionAsImage ] = useState( true );
	const { image2text, text2image, setImage2text, setText2image } = useQuestions();
	let newTextAnswers = getNewAnswers( image2text[ game ], image2text );
	let newImageAnswers = getNewAnswers( text2image[ game ], text2image );
	const [ possibleAnswers, setPossibleAnswers ] = useState( newTextAnswers );
	const [ userAnswer, setUserAnswer ] = useState();

	/**
	 * If we swap directions we toggle questionAsImage and switch to another question array
	 */
	function reverseDirection() {
		questionAsImage = !questionAsImage;
		setQuestionAsImage( questionAsImage );
		setPossibleAnswers( questionAsImage ? newTextAnswers : newImageAnswers );
	};

	/**
	 * The user has chosen and we now figure out what to do
	 *
	 * @param  {object} event - The event object to prevent default
	 */
	function handleAnswer( event ) {
		event.preventDefault();
		const gameSet = questionAsImage ? image2text : text2image;

		if( gameSet[ game ].image === userAnswer ) {
			setPossibleAnswers( tagAnswer( possibleAnswers, userAnswer, 'status', 'correct' ) );
			if( questionAsImage ) {
				setImage2text( tagAnswer( image2text, image2text[ game ].image, 'correct', true ) );
			}
			else {
				setText2image( tagAnswer( text2image, image2text[ game ].image, 'correct', true ) );
			}
			setCorrect( true );
			score ++;
			setScore( score );
		}
		else {
			setPossibleAnswers( tagAnswer( possibleAnswers, userAnswer, 'status', 'wrong' ) );
			if( questionAsImage ) {
				setImage2text( tagAnswer( image2text, image2text[ game ].image, 'correct', false ) );
			}
			else {
				setText2image( tagAnswer( text2image, image2text[ game ].image, 'correct', false ) );
			}
			score --;
			setScore( score );
		}

		setUserAnswer( null );
	};

	/**
	 * The user has found the right answer, let's now go to the next question
	 */
	function handleNextQuestion() {
		setCorrect( false );

		game ++;
		if( game === image2text.length ) {
			game = 0;
			setImage2text( shuffle( cleanTags( image2text, 'correct' ) ) );
			setText2image( shuffle( cleanTags( text2image, 'correct' ) ) );
			rounds ++;
			setRounds( rounds );
		}

		setgameRounds( game );
		newTextAnswers = getNewAnswers( image2text[ game ], image2text );
		newImageAnswers = getNewAnswers( text2image[ game ], text2image );
		setPossibleAnswers( questionAsImage ? newTextAnswers : newImageAnswers );
	};

	/**
	 * =~=~=~=~=~=~=~=~=~=
	 */
	return (
		<main>
			<header>
				<label>Switch <input type='checkbox' onClick={ reverseDirection } disabled={ correct } /></label>
				<Progress questions={ questionAsImage ? image2text : text2image } current={ game } rounds={ rounds } />
				game: { game }
				Logo
				Highscore
				Score: { score }
			</header>

			<form onSubmit={ ( event ) => handleAnswer( event ) }>
				{
					questionAsImage
						? <ImageView image={ image2text[ game ].image } alt={ image2text[ game ].alt } />
						: <TextView text={ text2image[ game ].text } />
				}

				<fieldset css={{
					overflow: 'hidden',
					padding: 0,
				}}>
					<legend>Answers:</legend>
					<Choices items={ possibleAnswers } questionAsImage={ questionAsImage } onAnswer={ setUserAnswer } onSuccess={ handleNextQuestion } correct={ correct } />
				</fieldset>
			</form>
		</main>
	);
};

Main.propTypes = {};

export default Main;
