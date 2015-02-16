/***************************************************************************************************************************************************************
 * HIGHSCORE
 *
 * Interact with the highscore
 **************************************************************************************************************************************************************/

var sanitizer = require('sanitizer');
var highscoreDB = db.collection('highscore');


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// private function: format highscore
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
function formatHighscore( res, mark ) {

	highscoreDB.find().sort( { score: -1 }, function(error, docs) {
		if( error || !docs ) {
			CONFIG.debugging( 'Highscore DB find error with: ' + error, 'error' );

			res.send({"code": "InternalError", "message": "Highscore DB find error with: " + error }); //output json
		}
		else {
			CONFIG.debugging( 'Got highscore from DB', 'report' );

			var highscore = docs;

			if( mark ) {
				for(var i = highscore.length - 1; i >= 0; i--) {

					if( ID.toString() === highscore[i]._id.toString() ) {
						highscore[i].justadded = true;
						break;
					}

				};
			}

			res.send(highscore); //output json
		}
	});

}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Get current highscore
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
function getHighscore(req, res, next) {
	CONFIG.debugging( 'Highscore requested', 'interaction' );

	formatHighscore( res, false );
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Save current highscore
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
function postHighscore(req, res, next) {
	CONFIG.debugging( 'Highscore posted', 'interaction' );

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
			CONFIG.debugging( 'Highscore DB find error with: ' + error, 'error' );
		}
		else if( docs ) {
			CONFIG.debugging( 'Highscore post already exists', 'error' );

			formatHighscore( res, false );
		}
		else {

			//insert to DB
			highscoreDB.insert(newEntry, function(error, thisInsert) {
				if( error || !thisInsert ) {
					CONFIG.debugging( 'Highscore DB insert error with: ' + error, 'error' );
				}
				else {
					CONFIG.debugging( 'Inserted highscore to DB', 'report' );

					var ID = thisInsert._id; //last insert ID

					formatHighscore( res, true );
				}
			});

		}
	});
}