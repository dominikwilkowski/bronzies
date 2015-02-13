/***************************************************************************************************************************************************************
 * API server
 *
 * Route to each functionality of the RestAPI
 **************************************************************************************************************************************************************/

var restify = require('restify');
var JsonDB = require('node-json-db'); //intermediate step until we find a nice DB a la Mongo
var chalk = require('chalk'); //making it pretty
var CFONTS = require('cfonts');
var HIGHSCORE = new JsonDB("./../json/highscore.json", false, false); //json database for highscore data
var QUESTIONS = new JsonDB("./../json/questions.json", false, false); //json database for question data


var server = restify.createServer({ name: 'Bronzies-RESTful-API' }); //start server

server
	.use(restify.fullResponse())
	.use(restify.bodyParser()); //plugins

server.get('/highscore', getHighscore); //highscore routes
server.post('/highscore', postHighscore);

server.get('/questions', getQuestions); //question routes


server.listen(5555, function() {

	console.log("\n\n");

	var fonts = new CFONTS({
		'text': '  Bronzies',
		'colors': ['red', 'yellow'],
		'letterSpacing': 0,
		'space': false
	});

	console.log( "\n" + '      ' + chalk.white.bgBlue.bold('    ' + server.name + ' listening at ' + server.url + '     ') + "\n\n" );
});