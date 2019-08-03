/** @jsx jsx */
import ImageView from './imageView';
import { jsx } from '@emotion/core';
import { tagAnswer } from './game';
import PropTypes from 'prop-types';
import TextView from './textView';
import { Fragment } from 'react';
import Choices from './choices';

/**
 * The body component shows the questions and choices respecting the direction of `questionAsImage`
 */
function GameBody({
	questions, setQuestions,
	index, setIndex,
	choices, setChoices,
	correct, setCorrect,
	userAnswer, setUserAnswer,
	rounds, setRounds,
	questionAsImage,
	score,
	handleNextQuestion,
	handleAnswer,
}) {
	return (
		<Fragment>
			<form onSubmit={ ( event ) => handleAnswer(
				event,
				questions,
				setQuestions,
				choices,
				setChoices,
				index,
				userAnswer,
				setUserAnswer,
				setCorrect,
				tagAnswer,
				score,
			)}>
				{
					questionAsImage
						? <ImageView image={ questions[ index ].image } alt={ questions[ index ].alt } />
						: <TextView text={ questions[ index ].text } />
				}

				<fieldset css={{
					overflow: 'hidden',
					padding: 0,
				}}>
					<legend>Answers:</legend>
					<Choices
						choices={ choices }
						questionAsImage={ questionAsImage }
						onAnswer={ setUserAnswer }
						onSuccess={ () => handleNextQuestion( questions, setQuestions, index, setIndex, rounds, setRounds, setCorrect, setChoices ) }
						correct={ correct }
					/>
				</fieldset>
			</form>
		</Fragment>
	);
};

GameBody.propTypes = {
	questions: PropTypes.array.isRequired,
	setQuestions: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired,
	setIndex: PropTypes.func.isRequired,
	choices: PropTypes.array.isRequired,
	setChoices: PropTypes.func.isRequired,
	correct: PropTypes.bool.isRequired,
	setCorrect: PropTypes.func.isRequired,
	userAnswer: PropTypes.string.isRequired,
	setUserAnswer: PropTypes.func.isRequired,
	rounds: PropTypes.number.isRequired,
	setRounds: PropTypes.func.isRequired,
	questionAsImage: PropTypes.bool.isRequired,
	score: PropTypes.number.isRequired,
	handleNextQuestion: PropTypes.func.isRequired,
	handleAnswer: PropTypes.func.isRequired,
};

export default GameBody;
