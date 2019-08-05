/** @jsx jsx */
import { animated, useSpring } from 'react-spring';
import { useGameData } from './app';
import { jsx } from '@emotion/core';
import { colors } from './theme';
import { useState } from 'react';

function RoundToggle() {
	const { setQuestionsDB } = useGameData();
	const [ round, setRound ] = useState('Signals');
	const [ isOpen, setIsOpen ] = useState( false );
	const { opacity } = useSpring({ opacity: isOpen ? 1 : 0 });

	return (
		<div css={{
			position: 'relative',
		}}>
			<button type='button' onClick={ () => setIsOpen( !isOpen ) } css={{
				apperance: 'none',
				border: 'none',
				background: 'transparent',
				padding: '1rem',
				fontSize: '1rem',
				color: colors[ 0 ],
				textDecoration: 'underline',
				cursor: 'pointer',
			}}>Round: { round }{isOpen?'open':'closed'}</button>
			<animated.div style={{ opacity }} css={{
				position: 'absolute',
				left: 0,
				bottom: 0,
				padding: '2rem',
				overflow: 'hidden',
			}}>
				Pekaboo
			</animated.div>
		</div>
	);
};

RoundToggle.propTypes = {};

export default RoundToggle;
