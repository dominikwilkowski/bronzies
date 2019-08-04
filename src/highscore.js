/** @jsx jsx */
import { useState, useEffect } from 'react';
import useRemoteData from './useRemoteData';
import { Link } from '@reach/router';
import { useGameData } from './app';
import { jsx } from '@emotion/core';
import { colors } from './theme';
import Loading from './loading';

function Highscore() {
	const [ highscore, setHighscore ] = useState([]);
	const {
		history,
	} = useGameData();

	console.log(history);

	const { data, loadingState } = useRemoteData('/api/highscore');
	useEffect( () => {
		if( loadingState === 'loaded' ) {
			setHighscore( data );
		}
	}, [ data, loadingState, setHighscore ]);

	return (
		<Loading data={ highscore } loadingState={ loadingState }>
			<div css={{
				margin: '0.5rem',
			}}>
				<Link to='/'>Go back to the game</Link>

				<h2 css={{
					fontSize: '2rem',
				}}>Score board</h2>
				<ol css={{
					listStyle: 'none',
					margin: '2rem 0',
					padding: 0,
					counterReset: 'highscore',
				}}>
					{
						highscore.map( ( item, i ) => (
							<li key={ i } css={{
								position: 'relative',
								margin: '1rem 0',
								padding: '0 1rem 0.5rem 155px',
								counterIncrement: 'highscore',
								':after': {
									content: 'counters(highscore, "", decimal-leading-zero)',
									position: 'absolute',
									top: 0,
									left: '15px',
									bottom: 0,
									width: '155px',
									fontSize: '6rem',
									fontWeight: '900',
									display: 'grid',
									alignContent: 'center',
								},
								':nth-of-type(odd)': {
									background: 'rgba( 100, 100, 100, 0.1 )',
								},
							}}>
								<span css={{
									display: 'inline-block',
									fontWeight: 100,
									fontSize: '3.2rem',
								}}>{ item.score }</span>
								<span css={{
									display: 'block',
									fontSize: '1.2rem',
								}}>{ item.name }</span>
							</li>
						))
					}
				</ol>
			</div>
		</Loading>
	);
};

Highscore.propTypes = {};

export default Highscore;
