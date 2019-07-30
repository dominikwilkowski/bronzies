/** @jsx jsx */
import { useTransition, animated } from 'react-spring';
import { jsx, keyframes } from '@emotion/core';
import { useQuestions } from './app';
import PropTypes from 'prop-types';
import { Fragment } from 'react';

/**
 * Animation showing a spinner
 */
function Animation() {
	const loading = keyframes({
		from: {
			backgroundPosition: '0px 0px',
		},
		to: {
			backgroundPosition: '-16px 0px',
		}
	});

	return (
		<div css={{
			position: 'fixed',
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			backgroundColor: '#fff',
			display: 'grid',
		}}>
			<div css={{
				margin: 'auto',
				textAlign: 'center',
				fontSize: '2rem',
			}}>
				<div css={{
					position: 'relative',
					width: '3rem',
					height: '3rem',
					border: '1px #000 solid',
					margin: '1rem auto 1.5rem auto',
					borderRadius: '100%',
					background: 'linear-gradient(45deg, transparent 49%, #000 50%, #000 50%, transparent 51%, transparent),' +
						'linear-gradient(-45deg, transparent 49%, #000 50%, #000 50%, transparent 51%, transparent)',
					backgroundSize: '16px 16px',
					backgroundPosition: '0% 0%',
					animation: `${ loading } 1s infinite linear`,
					'&:after': {
						content: '""',
						display: 'block',
						position: 'absolute',
						top: '-0.9rem',
						left: '-0.9rem',
						width: '4.8rem',
						height: '4.8rem',
						border: '1px #000 solid',
						boxSizing: 'border-box',
						borderRadius: '100%',
					}
				}}></div>
				<span>Loading</span>
			</div>
		</div>
	);
};

/**
 * Component to switch between loading spinner and component
 *
 * @param {function} options.Component - A component to display after loading is done
 */
function Loading({ Component }) {
	const { questionsDB } = useQuestions();
	const isLoading = questionsDB.length > 0;
	const transitions = useTransition( !isLoading, null, {
		initial: { opacity: 1 },
		from: { opacity: 1 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: { duration: 700 },
	});

	return (
		<Fragment>
			{
				transitions.map( ({ item, props }) => {
					return item
						? <animated.div key='loading' style={ props } css={{
								position: 'absolute',
								backgroundColor: '#fff',
								top: 0,
								left: 0,
								right: 0,
								zIndex: 2,
							}}><Animation /></animated.div>
						: <animated.div key='loaded' style={ props } css={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								zIndex: 1,
							}}><Component /></animated.div>
				}
			)}
		</Fragment>
	);
};

Loading.propTypes = {
	Component: PropTypes.func.isRequired,
};

export default Loading;
