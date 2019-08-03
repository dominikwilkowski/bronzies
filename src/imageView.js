/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';

function ImageView({ image, alt }) {
	return (
		<figure css={{
			textAlign: 'center',
			margin: 0,
		}}>
			<img src={`${ image }.jpg`} alt={ alt } css={{
				display: 'block',
				width: 'auto',
				height: '150px',
				margin: '0 auto',
			}} />
		</figure>
	);
};

ImageView.propTypes = {
	image: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
};

export default ImageView;
