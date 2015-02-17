/***************************************************************************************************************************************************************
 * QUESTIONS
 *
 * Get all Questions
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	var questionsDB = App.db.collection('questions');


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// Get questions
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function( req, res, next ) {
		App.debugging( 'Questions requested', 'interaction' );

		questionsDB.find({}, {}, function(error, docs) {
			if( error || !docs ) {
				App.debugging( 'Questions DB find error with: ' + error, 'error' );
			}
			else {

				App.debugging( 'Got questions from DB', 'report' );

				var questions = docs;

				res.send(questions); //output json
			}
		});
	};


	App.questions = module;

}(App));