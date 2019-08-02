/** @jsx jsx */
import { Link } from '@reach/router';
import { jsx } from '@emotion/core';

function Footer() {
	return (
		<footer>
			Footer here
			<Link to='/about'>About</Link>
		</footer>
	);
};

Footer.propTypes = {};

export default Footer;
