/** @jsxImportSource @emotion/react */

import { jsx, keyframes } from "@emotion/react";
import useInterval from "./useInterval";
import { Link } from "react-router-dom";
import { useState } from "react";
import { colors } from "./theme";
import useSound from "use-sound";
import Toggle from "./toggle";
import SVG from "./svg";

const BPM = 110;
// Calculate the interval - needs to be HALF the beat duration
const INTERVAL_MS = 60000 / BPM / 2; // 250ms at BPM rate
const ANIMATION_DURATION_S = 0.3; // Keep the original punchy animation

function CPR() {
	const [playSound] = useSound("heartbeat.mp3");
	const [refBeat, setBeat] = useState(false);
	const [mute, setMute] = useState(true);

	const heartbeat = keyframes({
		"from, to": {
			transform: "scale3D( 1, 1, 1 )",
		},
		"50%": {
			transform: "scale3D( 1.7, 1.5, 1.4 )",
		},
	});

	// Create the interval
	useInterval(() => {
		if (refBeat && !mute) {
			try {
				playSound();
			} catch (error) {
				console.log(error);
			}
		}

		setBeat(!refBeat);
	}, INTERVAL_MS);

	return (
		<main
			css={{
				margin: "0.5rem",
			}}
		>
			<Link to="/">Go back to the game</Link>
			<p>This is how fast you should do your CPR compressions</p>
			Enable sound:{" "}
			<Toggle
				isChecked={mute}
				setIsChecked={setMute}
				checkedColor={colors.action}
				uncheckedColor={colors.success}
				label="Enable sound"
			/>
			<div
				css={{
					position: "relative",
					marginTop: "5rem",
				}}
			>
				<SVG
					styling={{
						display: "block",
						width: "45vw",
						height: "45vw",
						maxWidth: "400px",
						maxHeight: "400px",
						margin: "0 auto 1rem auto",
						animation: `${refBeat ? heartbeat : null} ${ANIMATION_DURATION_S}s`,
					}}
					src="/sprite.svg#heart"
					title="Heart"
				/>
				<div
					css={{
						position: "absolute",
						top: "50%",
						left: 0,
						marginTop: "-1em",
						width: "100%",
						textAlign: "center",
						zIndex: 2,
						color: "#fff",
						fontWeight: 900,
						fontSize: "1.8rem",
					}}
				>
					{BPM} bpm
				</div>
			</div>
		</main>
	);
}

CPR.propTypes = {};

export default CPR;
