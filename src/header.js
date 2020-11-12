/** @jsxImportSource @emotion/react */

import { useGameData } from './app';
import { jsx } from '@emotion/react';
import { colors } from './theme';

function ImageView() {
	const {
		rounds,
		score,
	} = useGameData();

	return (
		<header>
			<h1 css={{
				textAlign: 'center',
				margin: '0.5rem 0 0 0',
			}}>Bronzies</h1>
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
					<span data-score css={{
						display: 'block',
						fontSize: '3rem',
						lineHeight: 1,
						textAlign: 'center',
						fontWeight: 900,
						color: score > 0
							? colors.success
							: score === 0
								? '#000'
								: colors.action,
					}}>{ score }</span>
				</div>
				<div css={{
					float: 'right',
					lineHeight: 1,
					marginRight: '0.5rem',
				}}>
					Round
					<span data-round css={{
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
