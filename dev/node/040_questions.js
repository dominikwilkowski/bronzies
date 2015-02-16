/***************************************************************************************************************************************************************
 * QUESTIONS
 *
 * Get all Questions
 **************************************************************************************************************************************************************/

var questionsDB = db.collection('questions');


//--------------------------------------------------------------------------------------------------------------------------------------------------------------
// Get questions
//--------------------------------------------------------------------------------------------------------------------------------------------------------------
function getQuestions(req, res, next) {
	CONFIG.debugging( 'Questions requested', 'interaction' );

	questionsDB.find({}, {}, function(error, docs) {
		if( error || !docs ) {
			CONFIG.debugging( 'Questions DB find error with: ' + error, 'error' );
		}
		else {

			CONFIG.debugging( 'Got questions from DB', 'report' );

			var questions = docs;

			res.send(questions); //output json
		}
	});
}