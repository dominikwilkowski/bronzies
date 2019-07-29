/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { colors } from './theme';

/**
 * A component to show the progress as dashes
 *
 * @param {array} options.questions - An array of questions
 * @param {integer} options.current - The current index
 * @param {integer} options.rounds  - how many rounds have been played
 */
function Progress({ questions, current, rounds }) {
	return (
		<Fragment>
				<ul css={{
				padding: 0,
				listStyle: 'none',
				display: 'flex',
				width: '98%',
				margin: '0 1%',
				boxSizing: 'border-box',
			}}>
				{
					questions.map( ( question, i ) => (
						<li key={ i } css={{
							display: 'inline-block',
							flex: 1,
							borderTop: `2px solid ${
								current === i
									? colors[ 2 ] // if it's the current question
									: i < current // if it was in the past
										? !question.correct
											? colors[ 0 ] // if it was the wrong answer
											: colors[ 3 ] // right answer
										: colors[ 4 ] // in the future
								}`,
							margin: '0 2px',
						}}></li>
					))
				}
			</ul>
			<span>{ rounds }</span>
		</Fragment>
	);
};

Progress.propTypes = {
	questions: PropTypes.array.isRequired,
	current: PropTypes.number.isRequired,
	rounds: PropTypes.number.isRequired,
};

export default Progress;
