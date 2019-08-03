/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';

function TextView({ text, styling }) {
	return (
		<span css={{
			display: 'block',
			textAlign: 'center',
			...styling,
		}}>
			{ text }
		</span>
	);
};

TextView.propTypes = {
	text: PropTypes.string.isRequired,
};

export default TextView;
