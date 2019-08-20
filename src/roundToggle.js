/** @jsx jsx */
import { animated, useTransition } from 'react-spring';
import { getSortedWrongAnswers } from './highscore';
import { shuffle, getNewAnswers } from './game';
import { Fragment, useState } from 'react';
import { useGameData } from './app';
import { jsx } from '@emotion/core';
import { colors } from './theme';
import Button from './button';

function Menu({ isOpen, setIsOpen, wrongAnswersLength, handleRoundChange, questionType }) {
	const { signals, wrongAnswers } = useGameData();
	const questions = getSortedWrongAnswers( wrongAnswers, signals );

	return (
		<Fragment>
			<div css={{
				position: 'relative',
				zIndex: 200,
				padding: '1rem 1rem 1.5rem 1rem',
				background: 'url("background.png")',
				textAlign: 'left',
			}}>
				<Button onClick={ () => setIsOpen( !isOpen ) } styling={{
					fontSize: '0.7rem',
					position: 'absolute',
					top: 0,
					right: 0,
				}}>close</Button>
				<p css={{
					margin: '1rem 0 0 0',
					fontWeight: 600,
					textAlign: 'center',
				}}>Choose what to learn</p>
				<ul css={{
					listStyle: 'none',
					margin: 0,
					padding: 0,
				}}>
					<li css={{
						position: 'relative',
						':after': {
							content: '""',
							display: questionType === 'Signals' ? 'block' : 'none',
							position: 'absolute',
							top: '1.4rem',
							left: 0,
							border: 'transparent 4px solid',
							borderLeft: `${ colors[ 0 ] } 7px solid`,
						},
					}}>
						<Button onClick={ () => handleRoundChange( signals, 'Signals' ) } mute={ questionType === 'Signals' } styling={{
							paddingBottom: '0.5rem',
						}}>
							Signals
						</Button>
						<small css={{
							display: 'block',
							color: '#000',
							margin: '0 1rem',
						}}>
							Learn the international SLSA signals to communicate between water and shore.
						</small>
					</li>
					<li css={{
						position: 'relative',
						':after': {
							content: '""',
							display: questionType === 'Practice' ? 'block' : 'none',
							position: 'absolute',
							top: '1.4rem',
							left: 0,
							border: 'transparent 4px solid',
							borderLeft: `${ colors[ 0 ] } 7px solid`,
						},
					}}>
						<Button onClick={ () => handleRoundChange( questions, 'Practice' ) } mute={ questionType === 'Practice' } styling={{
							paddingBottom: '0.5rem',
						}}>
							Practice
						</Button>
						<small css={{
							display: 'block',
							color: '#000',
							margin: '0 1rem',
						}}>
							Learn only those signals that you got wrong so far ({ wrongAnswersLength }).
						</small>
					</li>
				</ul>
			</div>
			<div onClick={ () => setIsOpen( !isOpen ) } css={{
				position: 'fixed',
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				zIndex: 100,
				background: 'rgba( 0, 0, 0, 0.5 )',
				cursor: 'pointer',
			}}></div>
		</Fragment>
	);
}

function RoundToggle() {
	const {
		signals,
		wrongAnswers,
		setQuestionsDB,
		setQuestionsImage,
		questionType, setQuestionType,
		setChoicesImage,
		setIndexImage,
		correctImage,
		setQuestionsText,
		setChoicesText,
		setIndexText,
		correctText,
	} = useGameData();
	const [ isOpen, setIsOpen ] = useState( false );
	const wrongAnswersLength = Object.keys( wrongAnswers ).length;

	const transitions = useTransition( isOpen, null, {
		initial: { opacity: 0 },
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: { duration: 300 },
	});

	function handleRoundChange( questions, questionType ) {
		setQuestionsDB( questions );

		const newQuestionsImage = shuffle( questions );
		setQuestionsImage( newQuestionsImage );
		const newChoicesImage = getNewAnswers( newQuestionsImage[ 0 ], newQuestionsImage, signals );
		setChoicesImage( newChoicesImage );
		setIndexImage( 0 );

		const newQuestionsText = shuffle( questions );
		setQuestionsText( newQuestionsText );
		const newChoicesText = getNewAnswers( newQuestionsText[ 0 ], newQuestionsText, signals );
		setChoicesText( newChoicesText );
		setIndexText( 0 );

		setQuestionType( questionType );
		setIsOpen( false );
	}

	let isMuted = false;
	if( wrongAnswersLength === 0 || correctImage || correctText ) {
		isMuted = true;
	}

	return (
		<div css={{
			position: 'relative',
		}}>
			<Button data-round-toggle onClick={ () => setIsOpen( !isOpen ) } mute={ isMuted }>
				Round: { questionType }
			</Button>
			{
				transitions.map( ({ item, props }) => {
					return item
						? <animated.div key='loading' style={ props } css={{
								position: 'absolute',
								left: '50%',
								top: '100%',
								width: '15rem',
								marginLeft: '-7.5rem',
								boxShadow: '0 10px 10px rgba(100,100,100,0.5)',
								zIndex: 10,
							}}>
								<Menu
									key={ isOpen }
									isOpen={ isOpen }
									setIsOpen={ setIsOpen }
									wrongAnswersLength={ wrongAnswersLength }
									handleRoundChange={ handleRoundChange }
									questionType={ questionType }
								/>
							</animated.div>
						: null
				})
			}
		</div>
	);
};

RoundToggle.propTypes = {};

export default RoundToggle;
