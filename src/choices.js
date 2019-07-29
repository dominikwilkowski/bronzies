/** @jsx jsx */
import { useSpring, animated } from 'react-spring';
import ImageView from './imageView';
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import TextView from './textView';
import { colors } from './theme';

function Choises({ items, questionAsImage, onAnswer, onSuccess, correct }) {
	const { right } = useSpring({
		right: correct ? '0px' : '-300px',
	});

	right.interpolate( o => console.log(o) );

	return (
		<ul css={{
			padding: 0,
			margin: 0,
		}}>
			{
				items.map( ( item, key ) => (
					<li key={ key } css={{
						position: 'relative',
						listStyle: 'none',
					}}>
						<button css={{
							display: 'block',
							appearance: 'none',
							width: '100%',
							background: item.status
								? item.status === 'correct'
									? colors[ 3 ]
									: colors[ 0 ]
								: 'transparent',
							color: item.status
								? '#fff'
								: '#000',
							padding: '12px',
							border: 'none',
							transition: 'background 0.3s ease, opcaity 0.3s ease, color 0.3s ease',
							fontSize: '21px',
							lineHeight: 1.2,
							'&:hover': {
								cursor: 'pointer',
							},
							'&:disabled': {
								opacity: 0.3,
							}
						}} type='submit' onClick={ event => onAnswer( item.image ) } disabled={ correct }>
							{
								questionAsImage
									? <TextView text={ item.text } />
									: <ImageView image={ item.image } alt={ item.alt } />
							}
						</button>
						<animated.div style={{ right }} css={{
							position: 'absolute',
							display: item.status === 'correct' ? 'block' : 'none',
							top: 0,
							width: '300px',
						}}>
							<button type='button' onClick={ onSuccess } css={{
								display: 'block',
								appearance: 'none',
								width: '300px',
								background: '#fff',
								color: '#000',
								padding: '12px',
								border: 'none',
								fontSize: '21px',
								lineHeight: 1.2,
								'&:hover': {
									cursor: 'pointer',
								},
							}}>Next question ⇢</button>
						</animated.div>
					</li>
				))
			}
		</ul>
	);
};

Choises.propTypes = {
	items: PropTypes.array.isRequired,
	questionAsImage: PropTypes.bool.isRequired,
	onAnswer: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
};

export default Choises;
