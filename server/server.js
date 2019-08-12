const corsMiddleware = require('restify-cors-middleware');
const restify = require('restify');
const cfonts = require('cfonts');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

/**
 * Setting global flag for debugging
 *
 * @type {boolean}
 */
const DEBUG = process.argv.includes('debug') ? true : false;

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
 * Getting the top 50 highscore
 *
 * @param  {object}   req  - The request object from express
 * @param  {object}   res  - The result object from express
 * @param  {function} next - The next function from express
 */
function getHighscore( req, res, next ) {
	debug( 'Highscore requested', 'interaction', req );

	const highscore = JSON.parse( fs.readFileSync( path.normalize(`${ __dirname }/assets/highscore${ DEBUG ? '-staging' : '' }.json`), { encoding: 'utf8' } ) );

	res.send( sortHighscore( highscore ) );
	return next();
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
 * Posting new highscore and returning the new json
 *
 * @param  {object}   req  - The request object from express
 * @param  {object}   res  - The result object from express
 * @param  {function} next - The next function from express
 */
function postHighscore( req, res, next ) {
	debug( 'Highscore posted', 'interaction', req );
	const { score, name, rounds, nays, history } = req.body;
	const controlScore = calcScore( history );

	if( controlScore.score === score && controlScore.nays === nays && controlScore.isValid ) {
		const highscore = JSON.parse( fs.readFileSync( path.normalize(`${ __dirname }/assets/highscore${ DEBUG ? '-staging' : '' }.json`), { encoding: 'utf8' } ) );
		highscore.push({
			name,
			score,
			rounds,
			nays,
			date: new Date().toISOString(),
		});

		try {
			fs.writeFileSync( path.normalize(`${ __dirname }/assets/highscore${ DEBUG ? '-staging' : '' }.json`), JSON.stringify( highscore ), { encoding: 'utf8' } );
		}
		catch( error ) {
			debug( error, 'error', req );
		}

		res.send( sortHighscore( highscore ) );
	}
	else {
		res.send({ error: 'You’re trying to cheat!!!' });
	}
	return next();
}

/**
 * Getting signals json
 *
 * @param  {object}   req  - The request object from express
 * @param  {object}   res  - The result object from express
 * @param  {function} next - The next function from express
 */
function getSignals( req, res, next ) {
	debug( 'Signals requested', 'interaction', req );

	const signals = require(`./assets/signals${ DEBUG ? '-staging' : '' }.json`);
	res.send( signals );
	return next();
}

/**
 * The function handler for static files for signal svg sprite
 *
 * @type {function}
 */
const serverStaticSignalSVG = restify.plugins.serveStatic({
	directory: `${ __dirname }/assets`,
	file: `signals${ DEBUG ? '-staging' : '' }.svg`,
	appendRequestPath: false,
});

/**
 * Getting static asset
 *
 * @param  {object}   req  - The request object from express
 * @param  {object}   res  - The result object from express
 * @param  {function} next - The next function from express
 */
function getSignalAsset( req, res, next ) {
	debug( 'Signals assets requested', 'interaction', req );

	serverStaticSignalSVG( req, res, next );
	return next();
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
		console.log(`${ chalk.red('\u2717 ') }${ ip } ${ time } ${ text }`);
	}
	else if( code === 'interaction' ) {
		console.log(`${ chalk.yellow('\u261C ') }${ ip } ${ time } ${ text }`);
	}
}

/**
 * Starting init server
 */
const port = 5555;
const server = restify.createServer({ name: 'Bronzies-API' });
const cors = corsMiddleware({
	origins: ['http://127.0.0.1:3000', 'http://localhost:3000'],
})

server.use( restify.plugins.bodyParser() );
server.pre( cors.preflight );
server.use( cors.actual );

// routes
server.get( '/api/highscore', getHighscore );
server.post( '/api/highscore', postHighscore );
server.get( '/api/signals', getSignals );
server.get( '/api/assets/*', getSignalAsset );

if( process.argv.includes('serve') ) {
	server.listen( port, () => {
		console.log('\n\n');

		cfonts.say('Bronzies', {
			colors: ['#EA1C2E', '#FFD520'],
			letterSpacing: 0,
			align: 'center',
			space: false,
		});

		if( DEBUG ) {
			cfonts.say('debug mode', {
				font: 'chrome',
				colors: ['#EA1C2E', '#FFD520', '#EA1C2E'],
				align: 'center',
				space: false,
			});
		}

		cfonts.say(`${ server.name } listening at 127.0.0.1:${ port }`, {
			font: 'console',
			colors: ['white'],
			background: 'blue',
			letterSpacing: 0,
			align: 'center',
			space: false,
		});

		debug( 'Server started', 'report' );
	});
}

module.exports = exports = {
	sortHighscore,
	convertQuestions,
	calcScore,
	debug,
};
