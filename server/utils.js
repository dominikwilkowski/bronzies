const chalk = require('chalk');

/**
 * Take an array of highscore and sort in in two different ways and return an object
 *
 * @param  {array}    highscore   - An array of highscore objects
 * @param  {integer}  top50Limit  - The number of top scores
 * @param  {integer}  latestLimit - The number of latest posts
 *
 * @return {object}               - An object with two arrays and an integer { top50: [array], latest: [array], length: [integer]}
 */
function sortHighscore( highscore, top50Limit = 50, latestLimit = 5 ) {
	const top50 = [ ...highscore ]
		.sort( ( a, b ) => b.score - a.score )
		.slice( 0, top50Limit );
	const latest = [ ...highscore ]
		.sort( ( a, b ) => new Date( b.date ) - new Date( a.date ) )
		.slice( 0, latestLimit );

	return { top50, latest, length: highscore.length };
}

/**
 * Convert a question array into an object where the image becomes the key
 *
 * @param  {array}  questions - An array of question objects
 *
 * @return {object}           - An object with all the original objects but with the image as key for each
 */
function convertQuestions( questions ) {
	const newQuestions = {};
	questions.map( question => {
		newQuestions[ question.image ] = question;
	});
	return newQuestions;
}

/**
 * Parse an history array to find score and nays
 *
 * @param  {array}  history - An array of arrays for each move
 *
 * @return {object}         - An object with score and nays numbers
 */
function calcScore( history ) {
	if( !Array.isArray( history ) ) {
		return { score: 0, nays: 0, isValid: false };
	}
	if( !history[ 0 ] ) {
		return { score: 0, nays: 0, isValid: false };
	}

	let isValid = true;
	let score = 0;
	let nays = 0;
	const questions = {};
	// we may add more types soon
	const questionTypes = {
		'Signals': `signals${ DEBUG ? '-staging' : '' }.json`,
	};
	const allQuestions = [ ...new Set( history.map( move => move[ 0 ] ) ) ];
	allQuestions.map( question => {
		if( questionTypes[ question ] ) {
			questions[ question ] = convertQuestions( require(`./assets/${ questionTypes[ question ] }`) )
		}
		else {
			questions[ question ] = null;
			isValid = false;
		}
	});

	if( !isValid ) {
		return { score: 0, nays: 0, isValid: false };
	}

	history.map( move => {
		const solution = questions[ move[ 0 ] ];
		if( solution[ move[ 1 ] ] ) {
			if( solution[ move[ 1 ] ].text === move[ 2 ] ) {
				score ++;
			}
			else {
				score --;
				nays ++;
			}
		}
		else {
			isValid = false;
		}
	});

	return { score, nays, isValid };
}

/**
 * A function to report back to stdout what's happening
 *
 * @param  {string} text - The text to be logged
 * @param  {string} code - The kind of message, can be: 'report', 'error' or 'interaction'
 * @param  {object} req  - The request object from express
 */
function debug( text, code, req ) {
	const ip = req ? chalk.blueBright(` [${ ( req.headers['x-forwarded-for'] || req.connection.remoteAddress || '' ).split(',')[ 0 ].trim() }]`) : '';
	const time = chalk.magentaBright( new Date().toISOString() );

	if( code === 'report' ) {
		console.log(`${ chalk.green('\u2713 ') }${ ip } ${ time } ${ text }`);
	}
	else if( code === 'error' ) {
		console.error(`${ chalk.red('\u2717 ') }${ ip } ${ time } ${ text }`);
	}
	else if( code === 'interaction' ) {
		console.log(`${ chalk.yellow('\u261C ') }${ ip } ${ time } ${ text }`);
	}
}

module.exports = exports = {
	sortHighscore,
	convertQuestions,
	calcScore,
	debug,
};
