/** @jsx jsx */
import { Link } from '@reach/router';
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import Progress from './progress';

function ImageView({ questions, index, rounds, score, correct, reverseDirection, questionAsImage }) {
	return (
		<header>
			<label>Switch <input type='checkbox' onChange={ reverseDirection } disabled={ correct } checked={ questionAsImage } /></label>
			<Progress questions={ questions } current={ index } rounds={ rounds } />
			index: { index }
			Logo
			<Link to='/highscore'>Highscore</Link>
			<Link to='/'>Game</Link>
			Score: { score }
		</header>
	);
};

ImageView.propTypes = {
	image: PropTypes.string.isRequired,
	questions: PropTypes.array.isRequired,
	index: PropTypes.number.isRequired,
	rounds: PropTypes.number.isRequired,
	score: PropTypes.number.isRequired,
	correct: PropTypes.bool.isRequired,
	reverseDirection: PropTypes.func.isRequired,
	questionAsImage: PropTypes.bool.isRequired,
};

export default ImageView;
