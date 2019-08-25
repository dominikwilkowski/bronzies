const { sortHighscore, convertQuestions, calcScore, debug } = require('./utils.js');
const corsMiddleware = require('restify-cors-middleware');
const restify = require('restify');
const cfonts = require('cfonts');
const path = require('path');
const fs = require('fs');


/**
 * Setting global flag for debugging
 *
 * @type {boolean}
 */
const DEBUG = process.argv.includes('debug') ? true : false;

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
 * Posting new highscore and returning the new json
 *
 * @param  {object}   req  - The request object from express
 * @param  {object}   res  - The result object from express
 * @param  {function} next - The next function from express
 */
function postHighscore( req, res, next ) {
	debug( 'Highscore posted', 'interaction', req );
	const { score, name, rounds, nays, history } = req.body;
	const controlScore = calcScore( history, DEBUG );

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
