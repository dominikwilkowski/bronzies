/** @jsx jsx */
import { jsx, keyframes } from '@emotion/core';
import { Link } from '@reach/router';
import SVG from './svg';

function CPR() {
	const heartbeat = keyframes({
		'from, to': {
			transform: 'scale3D( 1, 1, 1 )',
		},
		'50%': {
			transform: 'scale3D( 1.7, 1.5, 1.4 )',
		}
	});

	return (
		<main css={{
			margin: '0.5rem',
		}}>
			<Link to='/'>Go back to the game</Link>
			<p>Learn how fast the CPR rythm is</p>

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
				fontSize: '3vw',
			}}>
				120 bpm
			</div>

			<SVG styling={{
				display: 'block',
				width: '50px',
				height: '50px',
				margin: '0 auto 1rem auto',
				animation: `${ heartbeat } 0.3s`,
			}} src='/sprite.svg#heart' title='Heart' />
		</main>
	);
};

CPR.propTypes = {};

export default CPR;
