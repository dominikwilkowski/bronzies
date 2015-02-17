/***************************************************************************************************************************************************************
 *
 * Initiate app
 *
 **************************************************************************************************************************************************************/


var DEBUG = true;
if(DEBUG) console.log('%cDEBUGGING INFORMATION','font-size: 25px;');

//remove fallback HTML
$('.js-nojs').remove();


// check storeJS support
if(!store.enabled) {
	alert('localStorage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
}


//get all stored data
var QUESTIONS = store.get('questions');
var HIGHSCORE = store.get('highscore');


//if nothing has been stored yet
if( QUESTIONS === undefined ) {
	App.debugging('No data found in localStorage', 'error');
}
//if everything is in localStorage already
else {
	App.debugging('Data found in localStorage', 'report');
}

App.questions.init(); //start the app