/** @jsx jsx */
import { useSpring, animated } from 'react-spring';
import ImageView from './imageView';
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import TextView from './textView';
import { colors } from './theme';

/**
 * The Choices component shows the choices and validates the correctness and shows the next question button
 */
function Choices({ choices, questionAsImage, onAnswer, onSuccess, correct }) {
	const { right } = useSpring({
		right: correct ? '0px' : '-300px',
	});

	return (
		<ul data-answers css={{
			margin: 0,
			display: 'grid',
			gridGap: '1rem',
			gridTemplateColumns: '1fr',
			padding: '1rem 0',
			'@media(min-width: 600px)': {
				gridTemplateColumns: questionAsImage ? '1fr' : '1fr 1fr',
			},
			'@media(min-width: 900px)': {
				gridTemplateColumns: questionAsImage ? '1fr' : '1fr 1fr 1fr',
			},
			'@media(min-width: 1200px)': {
				gridTemplateColumns: questionAsImage ? '1fr' : '1fr 1fr 1fr 1fr',
			},
			'@media(min-width: 1500px)': {
				gridTemplateColumns: questionAsImage ? '1fr' : '1fr 1fr 1fr 1fr 1fr',
			},
		}}>
			{
				choices.map( ( choice, key ) => (
					<li key={ key } css={{
						position: 'relative',
						listStyle: 'none',
						overflow: 'hidden',
						'@media(min-width: 600px)': {
							border: `1px solid ${ colors.background }`,
						}
					}}>
						<button data-answer={ choice.status ? choice.status : '' } css={{
							display: 'block',
							appearance: 'none',
							width: '100%',
							background: choice.status
								? choice.status === 'correct'
									? colors.success
									: colors.action
								: 'transparent',
							color: choice.status
								? '#fff'
								: '#000',
							padding: '0',
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
						}} type='submit' onClick={ event => onAnswer( choice.image ) } disabled={ correct }>
							{
								questionAsImage
									? <TextView text={ choice.text } styling={{
										padding: '12px',
									}}/>
									: <ImageView image={ choice.image } alt={ choice.alt } />
							}
						</button>
						<animated.div style={{ right }} css={{
							position: 'absolute',
							alignContent: 'center',
							display: choice.status === 'correct' ? 'grid' : 'none',
							top: 0,
							bottom: 0,
							width: '300px',
						}}>
							<button
								data-next={ choice.status === 'correct' ? 'open' : 'close' }
								type='button'
								onClick={ choice.status === 'correct' ? onSuccess : null }
								css={{
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
								}}
							>Next question ⇢</button>
						</animated.div>
					</li>
				))
			}
		</ul>
	);
};

Choices.propTypes = {
	choices: PropTypes.array.isRequired,
	questionAsImage: PropTypes.bool.isRequired,
	onAnswer: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
	correct: PropTypes.bool.isRequired,
};

export default Choices;
