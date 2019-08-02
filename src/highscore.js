/** @jsx jsx */
import { useState, useEffect } from 'react';
import useRemoteData from './useRemoteData';
import { Link } from '@reach/router';
import { useGameData } from './app';
import { jsx } from '@emotion/core';
import Loading from './loading';
import Header from './header';

function Highscore() {
	const [ highscore, setHighscore ] = useState([]);
	const {
		questionsImage, setQuestionsImage,
		indexImage, setIndexImage,
		correctImage, setCorrectImage,
		roundsImage, setRoundsImage,
		questionsText, setQuestionsText,
		indexText, setIndexText,
		correctText, setCorrectText,
		roundsText, setRoundsText,
		questionAsImage, setQuestionAsImage,
		score,
	} = useGameData();

	const { data, loadingState } = useRemoteData('http://localhost:5555/api/highscore');
	useEffect( () => {
		if( loadingState === 'loaded' ) {
			setHighscore( data );
		}
	}, [ data, loadingState, setHighscore ]);

	return (
		<Loading data={ highscore } loadingState={ loadingState }>
			<Header
				questions={ questionAsImage ? questionsImage : questionsText }
				index={ questionAsImage ? indexImage : indexText }
				rounds={ questionAsImage ? roundsImage : roundsText }
				correct={ questionAsImage ? correctImage : correctText }
				score={ score }
				reverseDirection={ () => setQuestionAsImage( !questionAsImage ) }
				questionAsImage={ questionAsImage }
			/>

			<Link to='/'>Go back</Link>
			data: { JSON.stringify(highscore) }
		</Loading>
	);
};

Highscore.propTypes = {};

export default Highscore;
