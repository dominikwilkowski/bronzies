var restify = require('restify');
var JsonDB = require('node-json-db'); //intermediate step until we find a nice DB a la Mongo
var $HIGHSCORE = new JsonDB("./../json/highscore.json", false, false);
var $QUESTIONS = new JsonDB("./../json/questions.json", false, false);


var server = restify.createServer();
server.get('/highscore', getHighscore);
server.post('/highscore', pushHighscore);

server.get('/questions', getQuestions);


server.listen(5555, function() {
	console.log('%s listening at %s', server.name, server.url);
});