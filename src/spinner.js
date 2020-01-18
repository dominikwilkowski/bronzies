/** @jsx jsx */
import { jsx, keyframes } from '@emotion/core';

/**
 * Spinner for loading animations
 */
function Spinner() {
	const loading = keyframes({
		from: {
			transform: 'rotate(0deg)',
		},
		to: {
			transform: 'rotate(360deg)',
		},
	});

	return (
		<div css={{
			display: 'inline-block',
			width: '1em',
			height: '1em',
			margin: '0 0.5em',
			':after': {
				content: '" "',
				display: 'block',
				width: '0.8em',
				height: '0.8em',
				borderRadius: '50%',
				border: '0.1em solid currentColor',
				borderColor: 'currentColor transparent currentColor transparent',
				animation: `${ loading } 1.2s infinite linear`,
			},
		}}/>
	);
};

Spinner.propTypes = {};

export default Spinner;
