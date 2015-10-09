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
		QUESTIONGET: 'http://bronzies.com:5555/questions', //REST URL for getting questions
		HIGHSCOREGET: 'http://bronzies.com:5555/highscore', //REST URL for getting highscore
		HIGHSCOREPOST: 'http://bronzies.com:5555/highscore', //REST URL for posting highscore
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

			//click on splash screen
			$('.js-body').on('click', '.js-splash', function() {
				App.debugging('Splash screen clicked', 'interaction');

				$(this).removeClass('is-animating').addClass('is-closing');

			});

			App.scaffold.playground();
			App.popup.init();
			App.scroll.init();
			App.questions.get( false, function() {
				App.highscore.init();
				App.questions.draw();
				App.questions.get( true ); //load new questions in the background to keep this app updated
			});
			App.questions.init();
			App.animations.init();
		},


		//------------------------------------------------------------------------------------------------------------------------------------------------------------
		// what transistion prefix is supported in this browser?
		//------------------------------------------------------------------------------------------------------------------------------------------------------------
		whichTransitionEvent: function() { //By David Walsh: http://davidwalsh.name/css-animation-callback
			var t;
			var el = document.createElement("fakeelement");

			var transitions = {
				"transition": "transitionend",
				"OTransition": "oTransitionEnd",
				"MozTransition": "transitionend",
				"WebkitTransition": "webkitTransitionEnd"
			}

			for( t in transitions ) {
				if( el.style[t] !== undefined ) {
					return transitions[t];
				}
			}
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