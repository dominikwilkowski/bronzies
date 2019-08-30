/** @jsx jsx */
import { Link } from '@reach/router';
import { jsx } from '@emotion/core';
import SVG from './svg';

function Footer() {
	return (
		<footer css={{
			padding: '3rem 0 1rem 0',
			textAlign: 'center',
			gridRowStart: 3,
			gridRowEnd: 4,
		}}>
			<SVG styling={{
				display: 'block',
				width: '50px',
				height: '50px',
				margin: '0 auto 1rem auto',
			}} src='/sprite.svg#slsa-logo' title='SLSA Logo' />
			<Link to='/cpr'>Heart beat</Link><br/>
			<Link to='/about'>About the app</Link>
		</footer>
	);
};

Footer.propTypes = {};

export default Footer;
