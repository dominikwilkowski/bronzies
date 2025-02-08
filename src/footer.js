/** @jsxImportSource @emotion/react */

import { Link } from "react-router-dom";
import { jsx } from "@emotion/react";
import SVG from "./svg";

function Footer() {
	return (
		<footer
			css={{
				padding: "3rem 0 4rem 0",
				textAlign: "center",
				gridRowStart: 3,
				gridRowEnd: 4,
			}}
		>
			<SVG
				styling={{
					display: "block",
					width: "50px",
					height: "50px",
					margin: "0 auto 3rem auto",
				}}
				src="/sprite.svg#slsa-logo"
				title="SLSA Logo"
			/>
			<Link to="/cpr">
				<SVG
					styling={{
						height: "1em",
						width: "1em",
					}}
					src="/sprite.svg#heart"
					title="Heart"
				/>{" "}
				CPR beat
			</Link>
			<br />
			<div css={{ paddingTop: "2rem" }}>
				<Link to="/about">About the app</Link>
			</div>
		</footer>
	);
}

Footer.propTypes = {};

export default Footer;
