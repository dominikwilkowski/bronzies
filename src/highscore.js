/** @jsx jsx */
import { Link } from '@reach/router';
import { jsx } from '@emotion/core';

function Highscore() {
	return (
		<div>
			Higscore yay!
			<Link to='/'>Go back</Link>
		</div>
	);
};

Highscore.propTypes = {};

export default Highscore;
