/** @jsx jsx */
import { useGameData } from './app';
import { jsx } from '@emotion/core';
import { colors } from './theme';

function ImageView() {
	const {
		indexImage,
		roundsImage,
		indexText,
		roundsText,
		score,
		questionAsImage,
	} = useGameData();
	const index = questionAsImage ? indexImage : indexText;
	const rounds = questionAsImage ? roundsImage : roundsText;

	return (
		<header>
			<h1 css={{
				textAlign: 'center',
				margin: '0.5rem 0 0 0',
			}}>Bonzies</h1>
			<div css={{
				overflow: 'hidden',
				fontSize: '0.8rem',
			}}>
				<div css={{
					float: 'left',
					lineHeight: 1,
					marginLeft: '0.5rem',
				}}>
					Score
					<span css={{
						display: 'block',
						fontSize: '3rem',
						lineHeight: 1,
						textAlign: 'center',
						fontWeight: 900,
						color: score > 0
							? colors[ 3 ]
							: score === 0
								? '#000'
								: colors[ 0 ],
					}}>{ score }</span>
				</div>
				<div css={{
					float: 'right',
					lineHeight: 1,
					marginRight: '0.5rem',
				}}>
					Round
					<span css={{
						display: 'block',
						fontSize: '3rem',
						lineHeight: 1,
						textAlign: 'center',
						fontWeight: 900,
					}}>{ rounds }</span>
				</div>
			</div>
		</header>
	);
};

ImageView.propTypes = {};

export default ImageView;
