/** @jsx jsx */
import { version as appVersion } from '../package.json';
import { Fragment, useState, useEffect } from 'react';
import useRemoteData from './useRemoteData';
import { Link } from '@reach/router';
import { jsx } from '@emotion/core';
import Spinner from './spinner';

function About() {
	const [ serverVersion, setServerVersion ] = useState('');

	const { data, loadingState } = useRemoteData('/api/version');
	useEffect( () => {
		if( loadingState === 'loaded' ) {
			setServerVersion( data.version );
		}
	}, [ data, loadingState, setServerVersion ]);

	return (
		<main css={{
			margin: '0.5rem',
		}}>
			<Link to='/'>Go back to the game</Link>
			<h2>Hi there <span role='img' aria-label='waving hand'>👋</span></h2>
			<div css={{
				position: 'relative',
				paddingBottom: '2rem',
				marginBottom: '5rem',
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

				<span css={{
					display: 'block',
					marginTop: '1rem',
					fontSize: '0.7rem',
				}}>
					APP: v{appVersion}
				</span>
				<div css={{
					display: 'block',
					fontSize: '0.7rem',
				}}>
					Server: {
						loadingState !== 'loaded'
						? <Spinner/>
						: <Fragment>v{serverVersion}</Fragment>
					}
				</div>
			</div>

			<div css={{
				display: 'grid',
				gridTemplateColumns: '1fr',
				textAlign: 'center',
				'@media(min-width: 500px)': {
					gridTemplateColumns: '1fr 1fr',
					textAlign: 'left',
				},
			}}>
				<div>
					<h3 css={{
						fontSize: '5rem',
						margin: 0,
						fontFamily: 'serif',
						lineHeight: 0.8,
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
						lineHeight: 0.8,
					}}>Issues</h3>
					<a href='https://github.com/dominikwilkowski/bronzies/issues' rel='noopener noreferrer' target='_blank'>
						⇢ submit an issue
					</a>
				</div>
			</div>
		</main>
	);
};

About.propTypes = {};

export default About;
