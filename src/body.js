/** @jsx jsx */
import { tagAnswer } from './main';
import ImageView from './imageView';
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import TextView from './textView';
import Progress from './progress';
import { Fragment } from 'react';
import Choices from './choices';

function Body({
	questions, setQuestions,
	index, setIndex,
	choices, setChoices,
	correct, setCorrect,
	userAnswer, setUserAnswer,
	rounds, setRounds,
	questionAsImage,
	score, setScore,
	reverseDirection,
	handleNextQuestion,
	handleAnswer,
}) {
	return (
		<Fragment>
			<header>
				<label>Switch <input type='checkbox' onChange={ reverseDirection } disabled={ correct } checked={ questionAsImage } /></label>
				<Progress questions={ questions } current={ index } rounds={ rounds } />
				index: { index }
				Logo
				Highscore
				Score: { score }
			</header>
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
				setScore
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
						items={ choices }
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

Body.propTypes = {
	questionAsImage: PropTypes.bool.isRequired,
	setScore: PropTypes.func.isRequired,
	reverseDirection: PropTypes.func.isRequired,
	score: PropTypes.number.isRequired,

	// questions, setQuestions,
	// index, setIndex,
	// choices, setChoices,
	// correct, setCorrect,
	// userAnswer, setUserAnswer,
	// rounds, setRounds,
	// questionAsImage,
	// score, setScore,
	// reverseDirection,
	// handleNextQuestion,
	// handleAnswer
};

export default Body;
