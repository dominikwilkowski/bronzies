/** @jsx jsx */
import { Link } from '@reach/router';
import { useGameData } from './app';
import { jsx } from '@emotion/core';
import Progress from './progress';

function ImageView() {
	const {
		questionsImage,
		indexImage,
		correctImage,
		roundsImage,
		questionsText,
		indexText,
		correctText,
		roundsText,
		questionAsImage, setQuestionAsImage,
		score,
	} = useGameData();
	const questions = questionAsImage ? questionsImage : questionsText;
	const index = questionAsImage ? indexImage : indexText;
	const rounds = questionAsImage ? roundsImage : roundsText;
	const correct = questionAsImage ? correctImage : correctText;

	return (
		<header>
			<label>Switch <input type='checkbox' onChange={ () => setQuestionAsImage( !questionAsImage ) } disabled={ correct } checked={ questionAsImage } /></label>
			<Progress questions={ questions } current={ index } rounds={ rounds } />
			index: { index }
			Logo
			<Link to='/highscore'>Highscore</Link>
			<Link to='/'>Game</Link>
			Score: { score }
		</header>
	);
};

ImageView.propTypes = {};

export default ImageView;
