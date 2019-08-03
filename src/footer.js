/** @jsx jsx */
import { Link } from '@reach/router';
import { jsx } from '@emotion/core';
import SVG from './svg';

function Footer() {
	return (
		<footer>
			Footer here
			<Link to='/about'>About</Link>
			<SVG src='/sprite.svg#slsa-logo' title='SLSA Logo' />
		</footer>
	);
};

Footer.propTypes = {};

export default Footer;
