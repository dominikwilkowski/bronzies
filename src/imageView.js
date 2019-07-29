/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';

function ImageView({ image, alt }) {
	return (
		<figure>
			<img src={`${ image }.jpg`} alt={ alt } />
		</figure>
	);
};

ImageView.propTypes = {
	image: PropTypes.string.isRequired,
};

export default ImageView;
