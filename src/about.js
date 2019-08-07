/** @jsx jsx */
import { Link } from '@reach/router';
import { jsx } from '@emotion/core';

function About() {
	return (
		<main css={{
			margin: '0.5rem',
		}}>
			<Link to='/'>Go back to the game</Link>
			<div css={{
				margin: '2rem 1rem',
			}}>
				<h2>Hi there <span role='img' aria-label='waving hand'>👋</span></h2>
				<p css={{
					position: 'relative',
					paddingBottom: '2rem',
					marginBottom: '4rem',
					':after': {
						content: '""',
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: '-2rem',
						height: '2rem',
						background: 'repeating-linear-gradient( -45deg, transparent, transparent 12px, rgba( 100, 100, 100, 0.1 ) 12px, rgba( 100, 100, 100, 0.1 ) 30px )',
					}
				}}>
					My name is <a href='https://dominik-wilkowski.com' rel='noopener noreferrer' target='_blank'>Dominik</a> and I'm a
					trainer at <a href='https://bondisurfclub.com' rel='noopener noreferrer' target='_blank'>BSBSLC</a>.
				</p>

				<div css={{
					display: 'grid',
					gridTemplateColumns: '1fr',
					textAlign: 'center',
					'@media(min-width: 500px)': {
						gridTemplateColumns: '1fr 1fr',
						textAlign: 'left',
					},
				}}>
					<div css={{}}>
						<h3 css={{
							fontSize: '5rem',
							margin: 0,
							fontFamily: 'serif',
							lineHeight: 0.6,
						}}>Praise</h3>
						<a css={{
							display: 'block',
							marginBottom: '3rem',
						}} href='https://twitter.com/wilkowskidom' rel='noopener noreferrer' target='_blank'>
							Reach out on twitter ⇠
						</a>
					</div>

					<div css={{
						'@media(min-width: 500px)': {
							textAlign: 'right',
						},
					}}>
						<h3 css={{
							fontSize: '5rem',
							margin: 0,
							fontFamily: 'serif',
							lineHeight: 0.6,
						}}>Issues</h3>
						<a href='https://github.com/dominikwilkowski/bronzies/issues' rel='noopener noreferrer' target='_blank'>
							⇢ submit an issue
						</a>
					</div>
				</div>
			</div>
		</main>
	);
};

About.propTypes = {};

export default About;
