/***************************************************************************************************************************************************************
 * RESTful API
 *
 * Init the app and start it
 **************************************************************************************************************************************************************/

(function(App) {

	var module = {};

	var restify = require('restify'); //restify ftw
	var chalk = require('chalk'); //making it pretty
	var CFONTS = require('cfonts'); //colors!!
	var server = restify.createServer({ name: 'Bronzies-RESTful-App' }); //start server

	var questionsDB = App.db.collection('questions');


	//----------------------------------------------------------------------------------------------------------------------------------------------------------
	// starting the server and db connection
	//----------------------------------------------------------------------------------------------------------------------------------------------------------
	module.init = function() {
		// plugins
		server
			.use(restify.fullResponse())
			.use(restify.bodyParser()); //plugins

		App.debugging( 'Restify plugins installed', 'report' );


		// routes
		server.get( '/highscore', App.highscore.get ); //highscore routes
		server.post( '/highscore', App.highscore.post );

		server.get('/questions', App.questions.get); //question routes

		App.debugging( 'Routes established', 'report' );


		// server
		server.listen(5555, function() {

			console.log("\n\n");

			var fonts = new CFONTS({
				'text': '  Bronzies',
				'colors': ['red', 'yellow'],
				'letterSpacing': 0,
				'space': false
			});

			console.log( "\n" + '      ' + chalk.white.bgBlue.bold('    ' + server.name + ' listening at ' + server.url + '     ') + "\n\n" );

			App.debugging( 'Server started', 'report' );
		});
	};


	App.API = module;

}(App));


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Start App
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
App.API.init();