/** @jsx jsx */
import { soundManager } from 'soundmanager2/script/soundmanager2-nodebug';
// import { soundManager } from 'soundmanager2'; // debug version
import { jsx, keyframes } from '@emotion/core';
import { useState, useEffect } from 'react';
import useInterval from './useInterval';
import { Link } from '@reach/router';
import { colors } from './theme';
import Toggle from './toggle';
import SVG from './svg';

function CPR() {
	const [ refHeart, setRefHeart ] = useState( false );
	const [ mute, setMute ] = useState( true );
	const [ sound, setSound ] = useState({});

	const heartbeat = keyframes({
		'from, to': {
			transform: 'scale3D( 1, 1, 1 )',
		},
		'50%': {
			transform: 'scale3D( 1.7, 1.5, 1.4 )',
		}
	});

	// Setup soundManager
	useEffect( () => {
		if( soundManager.ok() ) {
			soundManager.setup({
				onready: () => {
					setSound(
						soundManager.createSound({
							id: 'beat',
							url: 'heartbeat.mp3',
							audioTagTimeToLive: 1000,
						})
					);
				},
			});
		}

		return () => soundManager.destroySound('beat');
	}, []);

	// Create the interval
	useInterval( () => {
		if( refHeart && !mute ) {
			sound.play();
		}

		setRefHeart( !refHeart );
	}, 250 );

	return (
		<main css={{
			margin: '0.5rem',
		}}>
			<Link to='/'>Go back to the game</Link>
			<p>This is how fast you should do your CPR compressions</p>
			Enable sound: <Toggle
				isChecked={ mute }
				setIsChecked={ setMute }
				checkedColor={ colors.action }
				uncheckedColor={ colors.success }
				label='Enable sound'
			/>

			<div css={{
				position: 'relative',
				marginTop: '5rem',
			}}>
				<SVG styling={{
					display: 'block',
					width: '45vw',
					height: '45vw',
					maxWidth: '400px',
					maxHeight: '400px',
					margin: '0 auto 1rem auto',
					animation: `${ refHeart ? heartbeat : null } 0.3s`,
				}} src='/sprite.svg#heart' title='Heart' />
				<div css={{
					position: 'absolute',
					top: '50%',
					left: 0,
					marginTop: '-1em',
					width: '100%',
					textAlign: 'center',
					zIndex: 2,
					color: '#fff',
					fontWeight: 900,
					fontSize: '1.8rem',
				}}>
					120 bpm
				</div>
			</div>
		</main>
	);
};

CPR.propTypes = {};

export default CPR;
