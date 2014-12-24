var restify = require('restify');
var JsonDB = require('node-json-db'); //intermediate step until we find a nice DB a la Mongo
var chalk = require('chalk'); //making it pretty
var $HIGHSCORE = new JsonDB("./../json/highscore.json", false, false); //json database for highscore data
var $QUESTIONS = new JsonDB("./../json/questions.json", false, false); //json database for question data


var server = restify.createServer({ name: 'Bronzies-RESTful-API' }); //start server

server
	.use(restify.fullResponse())
	.use(restify.bodyParser()); //plugins

server.get('/highscore', getHighscore); //highscore routes
server.post('/highscore', postHighscore);

server.get('/questions', getQuestions); //question routes


function color1( str ) { //foreground color
	return chalk.red( str );
}
function color2( str ) { //background color
	return chalk.yellow( str );
}

server.listen(5555, function() {
	console.log("\n\n" + //showing an awesome logo!
'     ' + color1('██████') + color2('╗ ') + color1('██████') + color2('╗  ') + color1('██████') + color2('╗') + ' ' +
color1('███') + color2('╗   ') + color1('██') + color2('╗') + color1('███████') + color2('╗') + color1('██') + color2('╗') +
color1('███████') + color2('╗') + color1('███████') + color2('╗') + "\n" +
'     ' + color1('██') + color2('╔══') + color1('██') + color2('╗') + color1('██') + color2('╔══') + color1('██') +
color2('╗') + color1('██') + color2('╔═══') + color1('██') + color2('╗') + color1('████') + color2('╗  ') + color1('██') +
color2('║╚══') + color1('███') + color2('╔╝') + color1('██') + color2('║') + color1('██') + color2('╔════╝') +
color1('██') + color2('╔════╝') + "\n" +
'     ' + color1('██████') + color2('╔╝') + color1('██████') + color2('╔╝') + color1('██') + color2('║   ') + color1('██') +
color2('║') + color1('██') + color2('╔') + color1('██') + color2('╗ ') + color1('██') + color2('║  ') + color1('███') +
color2('╔╝ ') + color1('██') + color2('║') + color1('█████') + color2('╗  ') + color1('███████') + color2('╗') + "\n" +
'     ' + color1('██') + color2('╔══') + color1('██') + color2('╗') + color1('██') + color2('╔══') + color1('██') +
color2('╗') + color1('██') + color2('║   ') + color1('██') + color2('║') + color1('██') + color2('║╚') + color1('██') +
color2('╗') + color1('██') + color2('║ ') + color1('███') + color2('╔╝  ') + color1('██') + color2('║') + color1('██') +
color2('╔══╝  ╚════') + color1('██') + color2('║') + "\n" +
'     ' + color1('██████') + color2('╔╝') + color1('██') + color2('║  ') + color1('██') + color2('║╚') + color1('██████') +
color2('╔╝') + color1('██') + color2('║ ╚') + color1('████') + color2('║') + color1('███████') + color2('╗') +
color1('██') + color2('║') + color1('███████') + color2('╗') + color1('███████') + color2('║') + "\n" +
'     ' + color2('╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝╚══════╝╚══════╝') + "\n\n");

	console.log( '     ' + chalk.white.bgBlue.bold('    ' + server.name + ' listening at ' + server.url + '    ') + "\n\n" );
});