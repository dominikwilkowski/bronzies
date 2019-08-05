/** @jsx jsx */
import { useGameData } from './app';
import { jsx } from '@emotion/core';
import { colors } from './theme';
import { useState } from 'react';

function RoundToggle() {
	const {
		setQuestionsDB,
	} = useGameData();
	const [ round, setRound ] = useState('Signals');

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
		}}>Round: { round }</button>
	);
};

RoundToggle.propTypes = {};

export default RoundToggle;
