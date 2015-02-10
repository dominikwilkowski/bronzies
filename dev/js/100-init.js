if(!store.enabled) {
	alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.');
}

var QUESTIONS = store.get('questions');
var HIGHSCORE = store.get('highscore');

if( QUESTIONS === undefined ) {
	console.log('start App');

	App.init();
	App.search.find();
}