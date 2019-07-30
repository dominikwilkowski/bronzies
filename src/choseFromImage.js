/** @jsx jsx */
import { shuffle, getNewAnswers, handleAnswer, handleNextQuestion, tagAnswer } from './main';
import { Fragment, useState } from 'react';
import { useQuestions } from './app';
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import TextView from './textView';
import Progress from './progress';
import Choices from './choices';

function ChoseFromText({ questionAsImage, setScore, reverseDirection, score }) {
	const { questionsDB } = useQuestions();
	const [ questions, setQuestions ] = useState( shuffle( questionsDB ) );
	const [ index, setIndex ] = useState( 0 );
	const newChoices = getNewAnswers( questions[ index ], questions );
	const [ choices, setChoices ] = useState( newChoices );
	const [ correct, setCorrect ] = useState( null );
	const [ userAnswer, setUserAnswer ] = useState();
	const [ rounds, setRounds ] = useState( 1 );

	return (
		<Fragment>
			<header>
				<label>Switch <input type='checkbox' onClick={ reverseDirection } disabled={ correct } checked={ questionAsImage } /></label>
				<Progress questions={ questions } current={ index } rounds={ rounds } />
				index: { index }
				Logo
				Highscore
				Score: { score }
			</header>
			<form onSubmit={ ( event ) => handleAnswer( event, questions, setQuestions, choices, setChoices, index, userAnswer, setUserAnswer, setCorrect, tagAnswer, score, setScore ) }>
				<TextView text={ questions[ index ].text } />

				<fieldset css={{
					overflow: 'hidden',
					padding: 0,
				}}>
					<legend>Answers:</legend>
					<Choices items={ choices } questionAsImage={ questionAsImage } onAnswer={ setUserAnswer } onSuccess={ () => handleNextQuestion( questions, setQuestions, index, setIndex, rounds, setRounds, setCorrect, setChoices ) } correct={ correct } />
				</fieldset>
			</form>
		</Fragment>
	);
};

ChoseFromText.propTypes = {
	questionAsImage: PropTypes.bool.isRequired,
	setScore: PropTypes.func.isRequired,
	reverseDirection: PropTypes.func.isRequired,
	score: PropTypes.number.isRequired,
};

export default ChoseFromText;
