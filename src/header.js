/** @jsx jsx */
import { Link } from '@reach/router';
import { useGameData } from './app';
import { jsx } from '@emotion/core';

function ImageView() {
	const {
		indexImage,
		roundsImage,
		indexText,
		roundsText,
		score,
		questionAsImage,
	} = useGameData();
	const index = questionAsImage ? indexImage : indexText;
	const rounds = questionAsImage ? roundsImage : roundsText;

	return (
		<header>
			index: { index }
			rounds: { rounds }
			<h1>Bonzies</h1>
			<Link to='/highscore'>Highscore</Link>
			<Link to='/'>Game</Link>
			Score: { score }
		</header>
	);
};

ImageView.propTypes = {};

export default ImageView;
