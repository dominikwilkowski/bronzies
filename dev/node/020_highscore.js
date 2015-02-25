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