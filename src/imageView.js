/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';

function ImageView({ item }) {
	return (
		<figure>
			<img src={`${ item }.jpg`} alt="Elephant at sunset" />
			<figcaption>Figcaption</figcaption>
		</figure>
	);
};

ImageView.propTypes = {
	item: PropTypes.string.isRequired,
};

export default ImageView;
