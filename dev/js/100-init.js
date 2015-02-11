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
	alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
}


//get all stored data
var QUESTIONS = store.get('questions');
var HIGHSCORE = store.get('highscore');


//if nothing has been stored yet
if( QUESTIONS === undefined ) {
	if(DEBUG) console.log('%c\u2612 ', 'color: red; font-size: 18px;', 'No data found in localStorage');

	App.questions.init();
}
//if everything is in storage already
else {
	if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Data found in localStorage');

	App.questions.init();
}