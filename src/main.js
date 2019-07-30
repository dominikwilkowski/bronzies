/** @jsx jsx */
import ChoseFromImage from './choseFromImage';
import ChoseFromText from './choseFromText';
import { jsx } from '@emotion/core';
import { useState } from 'react';

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

/**
 * The user has found the right answer, let's now go to the next question
 */
export function handleNextQuestion( questions, setQuestions, index, setIndex, rounds, setRounds, setCorrect, setChoices ) {
	setCorrect( null );

	let newIndex = index;
	if( index === questions.length - 1 ) {
		setQuestions( shuffle( cleanTags( questions, 'correct' ) ) );
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
 * @param  {object} event - The event object to prevent default
 */
export function handleAnswer( event, questions, setQuestions, choices, setChoices, index, userAnswer, setUserAnswer, setCorrect, tagAnswer, score, setScore ) {
	event.preventDefault();

	if( questions[ index ].image === userAnswer ) {
		setChoices( tagAnswer( choices, userAnswer, 'status', 'correct' ) );
		setQuestions( tagAnswer( questions, questions[ index ].image, 'correct', true ) );
		setCorrect( true );
		setScore( score ++ );
	}
	else {
		setChoices( tagAnswer( choices, userAnswer, 'status', 'wrong' ) );
		setQuestions( tagAnswer( questions, questions[ index ].image, 'correct', false ) );
		setCorrect( false );
		setScore( score -- );
	}

	setUserAnswer( null );
};

/**
 * The main game where we pull each components together
 */
function Main() {
	const [ questionAsImage, setQuestionAsImage ] = useState( true );
	const [ score, setScore ] = useState( 0 );

	/**
	 * If we swap directions we toggle questionAsImage and switch to another question array
	 */
	function reverseDirection( event ) {
		setQuestionAsImage( !questionAsImage );
	};

	/**
	 * =~=~=~=~=~=~=~=~=~=
	 */
	return (
		<main>
			{
				questionAsImage
					? <ChoseFromText questionAsImage={ questionAsImage } score={ score } setScore={ setScore } reverseDirection={ reverseDirection } />
					: <ChoseFromImage questionAsImage={ questionAsImage } score={ score } setScore={ setScore } reverseDirection={ reverseDirection } />
			}
		</main>
	);
};

Main.propTypes = {};

export default Main;
