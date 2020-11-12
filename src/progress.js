/** @jsxImportSource @emotion/react */

import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { colors } from './theme';

/**
 * A component to show the progress as dashes
 */
function Progress({ questions, current }) {
	return (
		<Fragment>
				<ul css={{
				padding: 0,
				listStyle: 'none',
				display: 'flex',
				width: '98%',
				margin: '0.5rem 1%',
			}}>
				{
					questions.map( ( question, i ) => {
						const status = current === i
							? 'current'   // if it's the current question
							: i < current // if it was in the past and ...
								? !question.correct
									? 'wrong' // ... it was the wrong answer
									: 'right' // ... it was the right answer
								: 'future'  // if it's in the future
						const statusColors = {
							current: colors.active,
							right: colors.success,
							wrong: colors.action,
							future: colors.background,
						};

						return (
							<li data-progress-status={ status } key={ i } css={{
								display: 'inline-block',
								flex: 1,
								borderTop: `4px solid ${ statusColors[ status ] }`,
								margin: '0 2px',
							}}></li>
						);
					})
				}
			</ul>
		</Fragment>
	);
};

Progress.propTypes = {
	questions: PropTypes.array.isRequired,
	current: PropTypes.number.isRequired,
};

export default Progress;
