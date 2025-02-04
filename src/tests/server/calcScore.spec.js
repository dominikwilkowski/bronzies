import { calcScore } from "../../../server/utils.js";

test("calcScore - Ignores wrong types", () => {
	const result = {
		score: 0,
		nays: 0,
		isValid: false,
	};

	expect(calcScore(null)).toStrictEqual(result);
	expect(calcScore(undefined)).toStrictEqual(result);
	expect(calcScore({})).toStrictEqual(result);
	expect(calcScore(1)).toStrictEqual(result);
	expect(calcScore([])).toStrictEqual(result);
	expect(calcScore(["wrong"])).toStrictEqual(result);
});

test("calcScore - Ignores arrays with missing item", () => {
	const input = [
		["Signals", "#questions-signal3", "Remain stationary"],
		["Signals", "#questions-signal44", "Remain stationary"],
		["#questions-signal3", "Remain stationary"],
		["Signals", "#questions-signal3", "Remain stationary"],
	];
	const result = {
		score: 0,
		nays: 0,
		isValid: false,
	};

	expect(calcScore(input)).toStrictEqual(result);
});

test("calcScore - Ignores arrays with wrong image", () => {
	const input = [
		["Signals", "#questions-signal3", "Proceed further out to sea"],
		["Signals", "#questions-signal44", "Proceed further out to sea"],
		["Signals", "#questions-signal3", "Proceed further out to sea"],
	];
	const result = {
		score: 2,
		nays: 0,
		isValid: false,
	};

	expect(calcScore(input)).toStrictEqual(result);
});

test("calcScore - Calculate simple score", () => {
	const input = [
		["Signals", "#questions-signal8", "Return to shore"],
		["Signals", "#questions-signal3", "Proceed further out to sea"],
		["Signals", "#questions-signal5", "Remain stationary"],
	];
	const result = {
		score: 3,
		nays: 0,
		isValid: true,
	};

	expect(calcScore(input)).toStrictEqual(result);
});

test("calcScore - Calculate simple nays", () => {
	const input = [
		["Signals", "#questions-signal2", "Remain stationary"],
		["Signals", "#questions-signal3", "Message not clear, repeat"],
		["Signals", "#questions-signal5", "Pick up swimmers2"],
	];
	const result = {
		score: -3,
		nays: 3,
		isValid: true,
	};

	expect(calcScore(input)).toStrictEqual(result);
});

test("calcScore - Calculate complex score and nays", () => {
	const input = [
		["Signals", "#questions-signal9", "Assistance required"], // correct
		["Signals", "#questions-signal11", "Emergency evacuation alarm"], // correct
		["Signals", "#questions-signal11", "Mass rescue"], // wrong
		["Signals", "#questions-signal14", "Signal Flag"], // wrong
		["Signals", "#questions-signal11", "Emergency evacuation alarm"], // correct
		["Signals", "#questions-signal5", "Remain stationary"], // correct
		["Signals", "#questions-signal12", "Pick up or adjust buoys"], // wrong
		["Signals", "#questions-signal10", "Shore signal received and understood"], // correct
		["Signals", "#questions-signal2", "Proceed further out to sea"], // wrong
		["Signals", "#questions-signal7", "Pick up or adjust buoys"], // correct
		["Signals", "#questions-signal11", "Emergency evacuation alarm"], // correct
		["Signals", "#questions-signal14", "Powercraft wishes to return to shore"], // correct
		["Signals", "#questions-signal3", "Proceed further out to sea"], // correct
		["Signals", "#questions-signal8", "Go to the left or the right"], // wrong
		["Signals", "#questions-signal2", "Pick up swimmers"], // correct
		["Signals", "#questions-signal11", "Mass rescue"], // wrong
		["Signals", "#questions-signal12", "Submerged victim missing"], // correct
		["Signals", "#questions-signal13", "All clear/OK"], // correct
		["Signals", "#questions-signal1", "Attract attention"], // correct
		["Signals", "#questions-signal11", "All Clear/OK"], // wrong
		["Signals", "#questions-signal11", "Mass rescue"], // wrong
		["Signals", "#questions-signal2", "Pick up swimmers"], // correct
		["Signals", "#questions-signal11", "Emergency evacuation alarm"], // correct
		["Signals", "#questions-signal14", "Powercraft wishes to return to shore"], // correct
		["Signals", "#questions-signal12", "Assistance required (Water to beach)"], // wrong
		["Signals", "#questions-signal9", "Assistance required"], // correct
		["Signals", "#questions-signal1", "Emergency evacuation alarm"], // wrong
		["Signals", "#questions-signal13", "All clear/OK"], // correct
		["Signals", "#questions-signal8", "Return to shore"], // correct
		["Signals", "#questions-signal12", "Submerged Patient Missing"], // wrong
		["Signals", "#questions-signal9", "Submerged Patient Missing"], // wrong
		["Signals", "#questions-signal10", "Submerged Patient Missing"], // wrong
		["Signals", "#questions-signal7", "Submerged Patient Missing"], // wrong
	];
	// 19 correct - 14 nays = 5
	const result = {
		score: 5,
		nays: 14,
		isValid: true,
	};

	expect(calcScore(input)).toStrictEqual(result);
});
