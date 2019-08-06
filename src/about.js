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
				margin: '1rem 0',
			}}>
				<h2>Hi there <span role='img' aria-label='waving hand'>👋</span></h2>
				<p>
					My name is <a href='https://dominik-wilkowski.com' rel='noopener noreferrer' target='_blank'>Dominik</a> and I'm a
					trainer at <a href='https://bondisurfclub.com' rel='noopener noreferrer' target='_blank'>BSBSLC</a>.
				</p>
				<p>
					If you have any issues or suggestions for the app
					please <a href='https://github.com/dominikwilkowski/bronzies/issues' rel='noopener noreferrer' target='_blank'>submit an issue</a>.
				</p>
			</div>
		</main>
	);
};

About.propTypes = {};

export default About;
