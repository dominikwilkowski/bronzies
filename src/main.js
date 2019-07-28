/** @jsx jsx */
import { shuffle, useQuestions } from './app';
import { useState, useEffect } from 'react';
import ImageView from './imageView';
import { jsx } from '@emotion/core';
import TextView from './textView';
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
 * Given an array of objects, add a string to the `status` key of the item with the matching `image` key
 *
 * @param  {array}  answers - An array of objects in the shape [{ image: 'String1' },{ image: 'String2' }]
 * @param  {string} image   - A string that should match one of the items in the array
 * @param  {string} tag     - The tag to be added
 *
 * @return {array}          - The original array but with a new `status` key [{ image: 'String1' },{ image: 'String2', status: 'String' }]
 */
export function tagAnswer( answers, image, tag ) {
	const newAnsers = [ ...answers ];

	return answers.map( answer => {
		if( answer.image === image ) {
			return { ...answer, status: tag };
		}
		else {
			return answer;
		}
	});
};

// The main game where we pull each components together
function Main() {
	const [ score, setScore ] = useState( 0 );
	const [ game, setgameRounds ] = useState( 0 );
	const [ rounds, setRounds ] = useState( 0 );
	const [ questionAsImage, setQuestionAsImage ] = useState( true );
	const { image2text, text2image, setImage2text, setText2image } = useQuestions();
	const newTextAnswers = getNewAnswers( image2text[ game ], image2text );
	const newImageAnswers = getNewAnswers( text2image[ game ], text2image );
	const [ possibleAnswers, setPossibleAnswers ] = useState( newTextAnswers );
	const [ answer, setAnswer ] = useState();

	function reverseDirection() {
		setQuestionAsImage( !questionAsImage );
		setPossibleAnswers( !questionAsImage ? newTextAnswers : newImageAnswers );
	};

	function handleAnswer( event ) {
		event.preventDefault();
		const gameSet = questionAsImage ? image2text : text2image;

		if( gameSet[ game ].image === answer ) {
			setPossibleAnswers( tagAnswer( possibleAnswers, answer, 'correct' ) );
			setgameRounds( game + 1 );
			console.log('correct');
		}
		else {
			setPossibleAnswers( tagAnswer( possibleAnswers, answer, 'wrong' ) );
			console.log('wrong');
		}
		setAnswer( null );
	};


	return (
		<main>
			<header>
				<label>Switch <input type='checkbox' onClick={ reverseDirection } /></label>
				questions: { image2text.length }
				rounds: { rounds }
				game: { game }
				Logo
				Highscore
				Score: { score }
			</header>

			<form onSubmit={ ( event ) => handleAnswer( event ) }>
				{
					questionAsImage
						? <ImageView item={ image2text[ game ].image } />
						: <TextView text={ text2image[ game ].text } />
				}

				<fieldset>
					<legend>Answers:</legend>
					<Choices items={ possibleAnswers } questionAsImage={ questionAsImage } action={ setAnswer } />
				</fieldset>
			</form>
		</main>
	);
};

Main.propTypes = {};

export default Main;
