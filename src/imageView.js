/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';

function ImageView({ image, alt }) {
	return (
		<figure css={{
			textAlign: 'center',
		}}>
			<img src={`${ image }.jpg`} alt={ alt } css={{
				width: 'auto',
				height: '150px',
			}} />
		</figure>
	);
};

ImageView.propTypes = {
	image: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
};

export default ImageView;
