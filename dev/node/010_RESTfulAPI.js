var restify = require('restify');
var JsonDB = require('node-json-db'); //intermediate step until we find a nice DB a la Mongo
var chalk = require('chalk'); //making it pretty
var CFONTS = require('cfonts'); //write in sexy font
var $HIGHSCORE = new JsonDB("./../json/highscore.json", false, false); //json database for highscore data
var $QUESTIONS = new JsonDB("./../json/questions.json", false, false); //json database for question data


var server = restify.createServer({ name: 'Bronzies-RESTful-API' }); //start server

server
	.use(restify.fullResponse())
	.use(restify.bodyParser()); //plugins

server.get('/highscore', getHighscore); //highscore routes
server.post('/highscore', postHighscore);

server.get('/questions', getQuestions); //question routes


console.log("\n\n");

var cfonts = new CFONTS({
	'text': ' bronzies', //text to be converted
	'letterSpacing': 1,
	'space': false,
	'colors': ['red', 'yellow'] //define all colors
});

console.log( "\n" + '      ' + chalk.white.bgBlue.bold('    ' + server.name + ' listening at ' + server.url + '    ') + "\n\n" );