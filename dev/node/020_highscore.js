/***************************************************************************************************************************************************************
 * HIGHSCORE
 *
 * Interact with the highscore
 **************************************************************************************************************************************************************/

var sanitizer = require('sanitizer');

//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Get current highscore
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
function getHighscore(req, res, next) {
	var highscore = HIGHSCORE.getData('/');

	res.send(highscore); //output json
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Save current highscore
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
function postHighscore(req, res, next) {
	var highscore = HIGHSCORE.getData('/');
	var data = req.params;

	data.name = sanitizer.escape( data.name );
	data.nays = sanitizer.escape( data.nays );
	data.score = sanitizer.escape( data.score );
	data.date = sanitizer.escape( data.date );

	highscore.push( data ); //add new data to object

	highscore = highscore //sort by score
		.sort(function(firstObject, SecondObject) {
			return SecondObject.score - firstObject.score;
	});

	HIGHSCORE.push('/', highscore);
	HIGHSCORE.save(); //write to json

	// identify this entry and mark it... also: doublepost protection...
	// data.justadded = true;

	res.send(highscore); //output json
}