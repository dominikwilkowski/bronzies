/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { colors } from './theme';

function Button({ children, onClick, mute, styling }) {
	return (
		<button type='button' onClick={ mute ? null : onClick } disabled={ mute } css={{
			apperance: 'none',
			border: 'none',
			background: 'transparent',
			padding: '1rem',
			fontSize: '1rem',
			color: mute ? '#000' : colors[ 0 ],
			textDecoration: mute ? 'default' : 'underline',
			cursor: mute ? 'default' : 'pointer',
			textAlign: 'inherit',
			...styling,
		}}>{ children }</button>
	);
};

Button.propTypes = {
	children: PropTypes.node.isRequired,
	onClick: PropTypes.func,
	mute: PropTypes.bool,
};

export default Button;
