/** @jsx jsx */
import { Link } from '@reach/router';
import { jsx } from '@emotion/core';
import SVG from './svg';

function CPR() {
	return (
		<main css={{
			margin: '0.5rem',
		}}>
			<Link to='/'>Go back to the game</Link>
			<h2>Learn how fast the CPR rythm is</h2>

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
			}} src='/sprite.svg#heart' title='Heart' />
		</main>
	);
};

CPR.propTypes = {};

export default CPR;
