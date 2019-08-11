/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import SVG from './svg';

function ImageView({ image, alt }) {
	return (
		<figure css={{
			textAlign: 'center',
			margin: 0,
		}}>
			<SVG styling={{
				display: 'block',
				width: '300px',
				height: '190px',
				margin: '0 auto',
			}} src={ image } title='What is this signal?' description={ alt } />
		</figure>
	);
};

ImageView.propTypes = {
	image: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
};

export default ImageView;
