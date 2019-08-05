/** @jsx jsx */
import { jsx } from '@emotion/core';
import { colors } from './theme';

function RoundToggle() {
	return (
		<button type='button' css={{
			apperance: 'none',
			border: 'none',
			background: 'transparent',
			padding: '1rem',
			fontSize: '1rem',
			color: colors[ 0 ],
			textDecoration: 'underline',
			cursor: 'pointer',
		}}>Mode: Signals</button>
	);
};

RoundToggle.propTypes = {};

export default RoundToggle;
