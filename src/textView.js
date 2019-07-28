/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';

function TextView({ text }) {
	return (
		<span>
			{ text }
		</span>
	);
};

TextView.propTypes = {
	text: PropTypes.string.isRequired,
};

export default TextView;
