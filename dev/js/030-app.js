/***************************************************************************************************************************************************************
 *
 * App framework and settings
 *
 **************************************************************************************************************************************************************/

'use strict';


var App = (function() {

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// settings
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	return {
		QUESTIONGET: 'http://127.0.0.1:5555/questions', //REST URL for getting questions
		HIGHSCOREGET: 'http://127.0.0.1:5555/highscore', //REST URL for getting highscore
		HIGHSCOREPOST: 'http://127.0.0.1:5555/highscore', //REST URL for posting highscore
		TIMEOUT: 7000, //Ajax timeout

		DEBUG: true, //debugging infos
		QUESTIONS: [], //current question round
		CORRECT: 0, //current correct answer
		PICK: 0, //current picked answer
		PICKTEXT: '', //current picked answer text for wrongs
		VIEW: 'P2T', //text-to-picture or picture-to-text [T2P, P2T]
		YAYS: 0, //correct answer count
		NAYS: 0, //wrong answer count
		WRONGS: {}, //wrong answers


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// Initiate app
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		init: function() {
			if( App.DEBUG ) console.log('%cDEBUGGING INFORMATION', 'font-size: 25px;');
			App.debugging('Initiating app', 'report');

			//remove fallback HTML
			$('.js-nojs').remove();

			// check storeJS support
			if(!store.enabled) {
				alert('localStorage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
			}

			App.questions.init(); //start the app
		},


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// debugging prettiness
		//
		// text  string   Text to be printed to debugger
		// code  keyword  What kind of urgency: report,error,interaction
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		debugging: function( text, code ) {

			if( code === 'report' ) {
				if( App.DEBUG ) console.log('%c\u2611 ', 'color: green; font-size: 18px;', text);
			}

			else if( code === 'error' ) {
				if( App.DEBUG ) console.log('%c\u2612 ', 'color: red; font-size: 18px;', text);
			}

			else if( code === 'interaction' ) {
				if( App.DEBUG ) console.log('%c\u261C ', 'color: blue; font-size: 18px;', text);
			}

		}

	}

}());