/***************************************************************************************************************************************************************
 * API server
 *
 * Route to each functionality of the RestAPI
 **************************************************************************************************************************************************************/

var restify = require('restify'); //restify ftw
var mongojs = require('mongojs'); //DB a la Mongo
var chalk = require('chalk'); //making it pretty
var CFONTS = require('cfonts'); //colors!!
var server = restify.createServer({ name: 'Bronzies-RESTful-API' }); //start server

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// DB
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
var db = mongojs(CONFIG.dbconnection, ['highscore', 'questions']);

CONFIG.debugging( 'Mongo database connected', 'report' );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// plugins
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
server
	.use(restify.fullResponse())
	.use(restify.bodyParser()); //plugins

CONFIG.debugging( 'Restify plugins installed', 'report' );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// routes
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
server.get('/highscore', getHighscore); //highscore routes
server.post('/highscore', postHighscore);

server.get('/questions', getQuestions); //question routes

CONFIG.debugging( 'Routes established', 'report' );


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// server
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
server.listen(5555, function() {

	console.log("\n\n");

	var fonts = new CFONTS({
		'text': '  Bronzies',
		'colors': ['red', 'yellow'],
		'letterSpacing': 0,
		'space': false
	});

	console.log( "\n" + '      ' + chalk.white.bgBlue.bold('    ' + server.name + ' listening at ' + server.url + '     ') + "\n\n" );

	CONFIG.debugging( 'Server started', 'report' );
});