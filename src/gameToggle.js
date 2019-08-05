/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { colors } from './theme';

function GameToggle({ isChecked, setIsChecked, isDisabled }) {
	return (
		<label css={{
			display: 'inline-block',
			position: 'relative',
			padding: '18px 0',
			marginLeft: '0.5rem',
			width: '50px',
			height: '12px',
			verticalAlign: 'middle',
			':before': {
				content: '""',
				position: 'absolute',
				display: 'inline-block',
				borderRadius: '20px',
				background: '#fff',
				border: '#999 1px solid',
				height: '12px',
				width: '50px',
				top: '12px',
				left: 0,
			},
			':hover': {
				cursor: 'pointer',
			}
		}}>
			<input
				css={{
					opacity: 0,
				}}
				type='checkbox'
				onChange={ () => setIsChecked( !isChecked ) }
				disabled={ isDisabled }
				checked={ isChecked }
			/>
			<span css={{
				display: 'block',
				width: '1px',
				height: '1px',
				padding: 0,
				margin: '-1px',
				overflow: 'hidden',
				clip: 'rect(0,0,0,0)',
				border: '0',
				textIndent: '-999999em',
				':after': {
					content: '""',
					position: 'absolute',
					display: 'inline-block',
					top: '6px',
					left: '26px',
					width: '24px',
					height: '24px',
					borderRadius: '50%',
					background: isChecked ? colors[ 0 ] : colors[ 1 ],
					border: '#333 1px solid',
					transition: 'left 0.3s ease, background 0.3s ease',
					'input:checked + &': {
						left: '0',
					},
				},
			}}>Toggle game mode</span>
		</label>
	);
};

GameToggle.propTypes = {
	isChecked: PropTypes.bool.isRequired,
	setIsChecked: PropTypes.func.isRequired,
	isDisabled: PropTypes.bool.isRequired,
};

export default GameToggle;
