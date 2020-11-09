/** @jsxImportSource @emotion/core */
import { useGameData } from './app';
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
	const { svg } = useGameData();

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
				<div data-question css={{
					margin: '2rem 0',
				}}>
					{
						questionAsImage
							? <ImageView image={ questions[ index ].image } alt={ questions[ index ].alt } />
							: <TextView text={ questions[ index ].text } styling={{
								position: 'relative',
								fontSize: '2rem',
								lineHeight: 1,
								':before': {
									content: '"“"',
									fontFamily: 'Serif',
									fontSize: '4rem',
								},
								':after': {
									content: '"”"',
									fontFamily: 'Serif',
									fontSize: '4rem',
								},
							}} />
					}
				</div>

				<fieldset css={{
					overflow: 'hidden',
					padding: 0,
					appearance: 'none',
					border: 'none',
					margin: 0,
				}}>
					<legend css={{
						width: '1px',
						height: '1px',
						padding: 0,
						margin: '-1px',
						overflow: 'hidden',
						clip: 'rect(0,0,0,0)',
						border: '0',
						textIndent: '-999999em',
					}}>Answers:</legend>
					<Choices
						choices={ choices }
						questionAsImage={ questionAsImage }
						onAnswer={ setUserAnswer }
						onSuccess={ () => handleNextQuestion( questions, setQuestions, svg, index, setIndex, rounds, setRounds, setCorrect, setChoices ) }
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
