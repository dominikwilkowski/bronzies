/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';

function ImageView({ image, alt }) {
	return (
		<figure>
			<img src={`${ image }.jpg`} alt={ alt } css={{
				width: 'auto',
				maxHeight: '150px',
			}} />
		</figure>
	);
};

ImageView.propTypes = {
	image: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
};

export default ImageView;
