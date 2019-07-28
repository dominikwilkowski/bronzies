/***************************************************************************************************************************************************************
 *
 *  RESTful API
 *
 * Initiate restify server and setting up routes
 *
 **************************************************************************************************************************************************************/

'use strict';


var App = (function() {

	var mongojs = require('mongojs'); //DB a la Mongo
	var chalk = require('chalk'); //making it pretty

	var restify = require('restify'); //restify ftw
	var CFONTS = require('cfonts'); //colors!!
	var server = restify.createServer({ name: 'Bronzies-RESTful-App' }); //start server


	return {
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// settings
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		debug: true, //debugging infos
		db: mongojs( 'mongodb://127.0.0.1:27017/bronzies', ['highscore', 'questions'] ), //mongo DB connection


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Initiate server
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		init: function() {

			//plugins
			server
				.use(restify.fullResponse())
				.use(restify.bodyParser()); //plugins

			App.debugging( 'Restify plugins installed', 'report' );


			//routes
			server.get( '/api/highscore', App.highscore.get ); //highscore routes
			server.post( '/api/highscore', App.highscore.post );

			server.get('/api/questions', App.questions.get); //question routes

			App.debugging( 'Routes established', 'report' );


			//server
			server.listen(5555, function() {

				console.log("\n\n");

				CFONTS.say('Bronzies', {
					colors: ['red', 'yellow'],
					letterSpacing: 0,
					align: 'center',
					space: false,
				});

				CFONTS.say( server.name + ' listening at ' + server.url, {
					font: 'console',
					colors: ['white'],
					letterSpacing: 0,
					align: 'center',
				});

				App.debugging( 'Server started', 'report' );
			});
		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// debugging prettiness
		//
		// text  string   Text to be printed to debugger
		// code  keyword  What kind of urgency: report,error,interaction
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		debugging: function( text, code ) {

			if( code === 'report' ) {
				if( App.debug ) console.log( chalk.green('\u2713 ') + text );
			}

			else if( code === 'error' ) {
				if( App.debug ) console.log( chalk.red('\u2717 ') + text );
			}

			else if( code === 'interaction' ) {
				if( App.debug ) console.log( chalk.blue('\u261C ') + text );
			}

		}

	};

})();


/***************************************************************************************************************************************************************
 *
 *  HIGHSCORE
 *
 * Getting latest and saving new highscores
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	var sanitizer = require('sanitizer');
	var highscoreDB = App.db.collection('highscore');


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// private function: format highscore
	//
	// res  resource  Restify resource object
	// ID   string    ID to be highlighted
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function formatHighscore( res, ID ) {
		App.debugging( 'Running formatHighscore' + ( ID ? ' with ' + ID : '' ), 'report' );

		highscoreDB.find().limit( 50 ).sort( { score: -1 }, function(error, docs) {
			if( error || !docs ) {
				App.debugging( 'Highscore DB find error with: ' + error, 'error' );

				res.send({"code": "InternalError", "message": "Highscore DB find error with: " + error }); //output json
			}
			else {
				App.debugging( 'Got highscore from DB', 'report' );

				var highscore = docs;

				if( ID.length ) {
					for(var i = highscore.length - 1; i >= 0; i--) {

						if( ID === highscore[i]._id.toString() ) {
							highscore[i].justadded = true;
							break;
						}

					};
				}

				res.send(highscore); //output json
			}
		});

	}


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Get current highscore
	//
	// req   object  Restify req object
	// res   object  Restify res object
	// next  object  Restify next object
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function( req, res, next ) {
		App.debugging( 'Highscore requested', 'interaction' );

		formatHighscore( res, '' );
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Save current highscore
	//
	// req   object  Restify req object
	// res   object  Restify res object
	// next  object  Restify next object
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.post = function( req, res, next ) {
		App.debugging( 'Highscore posted', 'interaction' );

		var data = req.params; //user data
		var newEntry = {};

		//sanitize user data
		newEntry.name = sanitizer.escape( data.name );
		newEntry.nays = parseInt( sanitizer.escape( data.nays ) );
		newEntry.score = parseInt( sanitizer.escape( data.score ) );
		newEntry.date = sanitizer.escape( data.date );


		//double post protection
		highscoreDB.find({
			name: newEntry.name,
			nays: newEntry.nays,
			score: newEntry.score,
			date: newEntry.date,
		}, {}, function(error, docs) {
			if( error ) {
				App.debugging( 'Highscore DB find error with: ' + error, 'error' );
			}
			else if( docs.length ) {
				App.debugging( 'Highscore post already exists', 'error' );
				console.info(docs.length);

				formatHighscore( res, '' );
			}
			else {

				//insert to DB
				highscoreDB.insert(newEntry, function(error, thisInsert) {
					if( error || !thisInsert ) {
						App.debugging( 'Highscore DB insert error with: ' + error, 'error' );

						res.send({"code": "InternalError", "message": "Highscore DB insert error with: " + error }); //output json
					}
					else {
						App.debugging( 'Inserted highscore to DB', 'report' );

						var ID = thisInsert._id; //last insert ID

						formatHighscore( res, ID.toString() );
					}
				});

			}
		});
	};


	App.highscore = module;

}(App));

/***************************************************************************************************************************************************************
 *
 *  QUESTIONS
 *
 * Get all Questions
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	var questionsDB = App.db.collection('questions');


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Get questions
	//
	// req   object  Restify req object
	// res   object  Restify res object
	// next  object  Restify next object
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function( req, res, next ) {
		App.debugging( 'Questions requested', 'interaction' );

		questionsDB.find({}, function(error, docs) {
			if( error || !docs ) {
				App.debugging( 'Questions DB find error with: ' + error, 'error' );
			}
			else {
				App.debugging( 'Got questions from DB', 'report' );

				// var questions = docs;
				const questions = [{
					"id": "579587de4a6c0920359fc689",
					"image": "signal1",
					"alt": "",
					"text": "To attract attention between a boat and the shore",
				},
				{
					"id": "579587de4a6c0920359fc68a",
					"image": "signal2",
					"alt": "",
					"text": "Return to shore",
				},
				{
					"id": "579587de4a6c0920359fc68b",
					"image": "signal3",
					"alt": "",
					"text": "Remain stationary",
				},
				{
					"id": "579587de4a6c0920359fc68c",
					"image": "signal4",
					"alt": "",
					"text": "Message not clear, repeat",
				},
				{
					"id": "579587de4a6c0920359fc68d",
					"image": "signal5",
					"alt": "",
					"text": "Pick up swimmers",
				},
				{
					"id": "579587de4a6c0920359fc68e",
					"image": "signal6",
					"alt": "",
					"text": "Investigate submerged object",
				},
				{
					"id": "579587de4a6c0920359fc68f",
					"image": "signal7",
					"alt": "",
					"text": "Proceed further out to sea",
				},
				{
					"id": "579587de4a6c0920359fc690",
					"image": "signal8",
					"alt": "",
					"text": "Go to the left or the right",
				},
				{
					"id": "579587de4a6c0920359fc691",
					"image": "signal9",
					"alt": "",
					"text": "Message understood, all clear",
				},
				{
					"id": "579587de4a6c0920359fc692",
					"image": "signal10",
					"alt": "",
					"text": "Pick up or adjust buoys",
				},
				{
					"id": "579587de4a6c0920359fc693",
					"image": "signal11",
					"alt": "",
					"text": "Assistance required",
				},
				{
					"id": "579587de4a6c0920359fc694",
					"image": "signal12",
					"alt": "",
					"text": "Boat wishes to return to shore",
				},
				{
					"id": "579587de4a6c0920359fc695",
					"image": "signal13",
					"alt": "",
					"text": "Emergency evacuation alarm (Water to beach)",
				},
				{
					"id": "579587de4a6c0920359fc696",
					"image": "signal14",
					"alt": "",
					"text": "Shore signal received and understood",
				},
				{
					"id": "579587de4a6c0920359fc697",
					"image": "signal15",
					"alt": "",
					"text": "Search completed",
				},
				{
					"id": "579587de4a6c0920359fc698",
					"image": "signal16",
					"alt": "",
					"text": "Emergency evacuation flag",
				},
				{
					"id": "579587de4a6c0920359fc699",
					"image": "signal17",
					"alt": "",
					"text": "Emergency evacuation alarm",
				},
				{
					"id": "579587de4a6c0920359fc69a",
					"image": "signal18",
					"alt": "",
					"text": "Mass rescue",
				},
				{
					"id": "579587de4a6c0920359fc69b",
					"image": "signal19",
					"alt": "",
					"text": "Helicopter signal—request to enter",
				},
				{
					"id": "579587de4a6c0920359fc69c",
					"image": "signal20",
					"alt": "",
					"text": "Signal Flag",
				},
				{
					"id": "579587de4a6c0920359fc69d",
					"image": "signal21",
					"alt": "",
					"text": "Submerged Patient Missing",
				},
				{
					"id": "579587de4a6c0920359fc69e",
					"image": "signal22",
					"alt": "",
					"text": "All Clear/OK",
				}];

				res.send(questions); //output json
			}
		});
	};


	App.questions = module;

}(App));


/***************************************************************************************************************************************************************
 *
 *  Start App
 *
 **************************************************************************************************************************************************************/


App.init(); //start app
