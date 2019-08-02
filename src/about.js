/** @jsx jsx */
import { jsx } from '@emotion/core';
import Header from './header';
import Footer from './footer';

function About() {
	return (
		<main>
			<Header />
			The about page
			<Footer />
		</main>
	);
};

About.propTypes = {};

export default About;
