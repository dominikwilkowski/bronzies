/** @jsxImportSource @emotion/react */

import { Fragment, useState, useEffect } from 'react';
import useRemoteData from './useRemoteData';
import { Link } from 'react-router-dom';
import { useGameData } from './app';
import { jsx } from '@emotion/react';
import { onUnload } from './game';
import Loading from './loading';

/**
 * Return the position of a score within the highscore array
 *
 * @param  {number} score     - The current score
 * @param  {array}  highscore - An array of objects with a score key
 *
 * @return {integer}          - The position the new score would take amongst the highscore array
 */
function getPosition( score, highscore ) {
	return [
		...highscore,
		{
			myself: true,
			score,
		}
	]
		.sort( (a, b) => b.score - a.score )
		.findIndex( item => item.myself ) + 1;
};

/**
 * Sort all wrong answers by highest first then return an array of them in an array as question object from db
 *
 * @param  {object} wrongAnswers - An object of all wrong answers
 * @param  {array}  db           - A collection of all questions
 *
 * @return {array}               - An array of all wrong answers sorted and as full objects each
 */
export function getSortedWrongAnswers( wrongAnswers, db ) {
	return Object
		.entries({ ...wrongAnswers })
		.sort( ( a, b ) => b[ 1 ] - a[ 1 ] )
		.map( item => db.find( a => a.image === item[ 0 ] ) );
};

function Highscore() {
	const { signals, score, resetScore, nays, rounds, history, wrongAnswers } = useGameData();
	const [ highscore, setHighscore ] = useState([]);
	const [ name, setName ] = useState('');
	const [ isSubmitting, setIsSubmitting ] = useState( false );
	const myPosition = getPosition( score, highscore.top50 ? highscore.top50 : [] );
	const hasPlayed = history.length > 0;
	const wrongAnswersDB = getSortedWrongAnswers( wrongAnswers, signals );
	// generated with https://pinetools.com/gradient-generator
	const gradient = [
		'#32863b', '#30853d', '#2f843f', '#2e8341', '#2d8243', '#2c8246', '#2b8148', '#2a804a', '#297f4c', '#287f4f',
		'#277e51', '#267d53', '#257c55', '#247b58', '#237b5a', '#227a5c', '#21795e', '#207861', '#1f7863', '#1e7765',
		'#1d7667', '#1c756a', '#1b746c', '#1a746e', '#197370', '#187273', '#177175', '#167177', '#157079', '#146f7c',
		'#136e7e', '#126d80', '#116d82', '#106c85', '#0f6b87', '#0e6a89', '#0d6a8b', '#0c698e', '#0b6890', '#0a6792',
		'#096694', '#086697', '#076599', '#06649b', '#05639d', '#0463a0', '#0362a2', '#0261a4', '#0160a6', '#0060a8',
	];
	const fontScale = [
		'1.2rem',
		'1.075rem',
		'0.95rem',
		'0.825rem',
		'0.7rem',
	];

	const { data, loadingState } = useRemoteData('/api/highscore');
	useEffect( () => {
		if( loadingState === 'loaded' ) {
			setHighscore( data );
		}
	}, [ data, loadingState, setHighscore ]);

	async function handleSubmit( event ) {
		event.preventDefault();
		if( hasPlayed ) {
			setIsSubmitting( true );
			// const Sleep = wait => new Promise( resolve => setTimeout( resolve, wait ) );
			// await Sleep( 5000 );
			const response = await fetch('/api/highscore', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					score,
					nays,
					history,
					rounds,
				}),
			});
			setHighscore( await response.json() );
			window.removeEventListener( 'beforeunload', onUnload );
			setName('');
			resetScore();
			setIsSubmitting( false );
		}
	};

	return (
		<Loading loadingState={ loadingState }>
			<Link to='/' data-back-link css={{
				display: 'block',
				margin: '1rem 0.5rem',
			}}>Go back to the game</Link>

			{
				wrongAnswersDB.length > 0
					? <Fragment>
							<p data-most-wrong css={{
								textAlign: 'center',
							}}>The answers you got wrong the most are:</p>
							<ul data-most-wrong-list css={{
								position: 'relative',
								padding: '0 0 2rem 0',
								margin: '0 0 4rem 0',
								textAlign: 'center',
								listStyle: 'none',
								':after': {
									content: '""',
									position: 'absolute',
									left: 0,
									right: 0,
									bottom: '-2rem',
									height: '2rem',
									background: 'repeating-linear-gradient( -45deg, transparent, transparent 12px, rgba( 100, 100, 100, 0.1 ) 12px, rgba( 100, 100, 100, 0.1 ) 30px )',
								}
							}}>
								{
									wrongAnswersDB.slice( 0, 5 ).map( ( answer, i ) => (
										<li key={ i } css={{
											margin: '0.5rem 0',
										}}>
											{ answer.text }
										</li>
									))
								}
							</ul>
						</Fragment>
					: null
			}

			{
				hasPlayed
					? <form data-input-form onSubmit={ handleSubmit } css={{
						position: 'relative',
						textAlign: 'center',
						fontSize: '1.3rem',
						padding: '0 0.5rem 2rem 0.5rem',
						margin: '1rem 0 4rem 0',
						':after': {
							content: '""',
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: '-2rem',
							height: '2rem',
							background: 'repeating-linear-gradient( -45deg, transparent, transparent 12px, rgba( 100, 100, 100, 0.1 ) 12px, rgba( 100, 100, 100, 0.1 ) 30px )',
						}
					}}>
						<p>Enter yourself into the score board with your current score of { score }.</p>
						<strong css={{
							fontStyle: 'italic',
						}}>(Your score will be set to zero)</strong>
						{
							nays > 0
								? <p>
									According to your score you now have to do <span css={{ fontWeight: 900 }}>{ nays * 5 }</span> pushups.
								</p>
								: null
						}

						{
							myPosition < 50
								? <p css={{ fontWeight: 800, }}>
										You made it into the top 50, to position
										<span css={{
											color: gradient[ myPosition ],
											fontSize: '2rem',
											margin: '0.4rem',
										}}>
											{ myPosition }
										</span>
									</p>
								: null
						}

						<label>
							<span css={{ display: 'block', }}>Your name:</span>
							<input
								type='text'
								placeholder='Enter your name'
								disabled={ isSubmitting }
								value={ name }
								onChange={ event => setName( event.target.value ) }
								css={{
									apperance: 'none',
									boxShadow: 'none',
									border: 'none',
									padding: '1rem',
									fontSize: '1.5rem',
									width: '80%',
									margin: '0.5rem 0 0 0',
									textAlign: 'center',
									':disabled': {
										background: 'rgba( 255, 255, 255, 0.5 )',
										color: 'rgba( 0, 0, 0, 0.5 )',
										cursor: 'wait',
									},
								}}
							/>
						</label>
					</form>
				: null
			}

			<h2 css={{
				fontSize: '2rem',
				textAlign: 'center',
				fontWeight: 400,
				textTransform: 'uppercase',
				marginBottom: 0,
			}}>Latest entries</h2>
			<span css={{
				display: 'block',
				fontSize: '1.5rem',
				fontWeight: 100,
				textAlign: 'center',
			}}>Total: { highscore.length }</span>
			<ol css={{
				listStyle: 'none',
				margin: '1rem 0 4rem 0',
				padding: 0,
				textAlign: 'center',
			}}>
				{
					highscore.latest
						? highscore.latest.map( ( score, i ) => (
								<li key={ i } css={{
									margin: '0.5rem 0',
									fontSize: fontScale[ i ],
								}}>
									{ score.name } &mdash; <span css={{ fontWeight: 600 }}>{ score.score }</span>
								</li>
							))
						: null
				}
			</ol>

			<h2 css={{
				fontSize: '2rem',
				textAlign: 'center',
				fontWeight: 400,
				textTransform: 'uppercase',
				marginBottom: 0,
			}}>Score board</h2>
			<span css={{
				display: 'block',
				fontSize: '1.5rem',
				fontWeight: 100,
				textAlign: 'center',
			}}>Top 50</span>
			<ol css={{
				listStyle: 'none',
				margin: '2rem 0',
				padding: 0,
			}}>
				{
					highscore.top50
						? highscore.top50.map( ( item, i ) => (
							<li key={ i } css={{
								position: 'relative',
								margin: 0,
								padding: '1rem',
								display: 'grid',
								gridTemplateColumns: '1fr 1fr',
								':nth-of-type(odd)': {
									background: 'rgba( 100, 100, 100, 0.1 )',
								},
							}}>
								<span css={{
									fontSize: '6rem',
									fontWeight: '900',
									display: 'grid',
									alignContent: 'center',
									textAlign: 'right',
									margin: '0 1rem 0 0',
									color: gradient[ i ],
								}}>
									{ i < 9 ? `0${ i + 1 }` : i + 1 }
								</span>
								<div css={{
									display: 'grid',
									alignContent: 'center',
								}}>
									<div css={{
										position: 'relative',
										display: 'inline-block',
										fontWeight: 300,
										fontSize: '3.2rem',
										paddingLeft: '1.3rem',
										wordBreak: 'break-all',
									}}>
										<span css={{
											position: 'absolute',
											transform: 'rotate(-90deg)',
											fontSize: '1rem',
											fontWeight: 400,
											top: '1.5rem',
											left: '-12px',
										}}>
											Score
										</span>
										{ item.score }
									</div>
									<span css={{
										display: 'block',
										fontSize: '1.2rem',
										wordBreak: 'break-all',
									}}>
										{ item.name }
									</span>
								</div>
							</li>
						))
						: null
				}
			</ol>
		</Loading>
	);
};

Highscore.propTypes = {};

export default Highscore;
