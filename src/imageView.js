/** @jsxImportSource @emotion/react */

import { jsx } from "@emotion/react";
import PropTypes from "prop-types";
import SVG from "./svg";

function ImageView({ image, alt }) {
	return (
		<figure
			data-id={image}
			css={{
				textAlign: "center",
				margin: 0,
			}}
		>
			<SVG
				styling={{
					display: "block",
					width: "340px",
					height: "300px",
					margin: "0 auto",
				}}
				src={image}
				title="What is this signal?"
				description={alt}
			/>
		</figure>
	);
}

ImageView.propTypes = {
	image: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
};

export default ImageView;
