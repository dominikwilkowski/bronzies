/** @jsx jsx */
import { Link } from '@reach/router';
import { jsx } from '@emotion/core';

function About() {
	return (
		<main>
			<Link to='/'>Go back</Link>
			The about page
		</main>
	);
};

About.propTypes = {};

export default About;
