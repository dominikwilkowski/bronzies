/***************************************************************************************************************************************************************
 *
 * Loading
 *
 **************************************************************************************************************************************************************/


(function(App) {

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// private function: what transistion prefix is supported in this browser?
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function whichTransitionEvent() { //By David Walsh: http://davidwalsh.name/css-animation-callback
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
	}


	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// start or stop the loading animation
	//
	// start  boolen  Start or stop the loading animation
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.start = function( start ) {
		App.debugging('Loading ' + (start ? 'started' : 'stopped'), 'report');

		//start loading
		if(start) {
			if( !$('.js-loading').length ) { //rescaffold only if not exist yet
				App.scaffold.loading();

				$('.js-loading').css({ opacity: 0 }).css({ opacity: 1 });
			}
		}
		//stop loading
		else {
			$('.js-loading').css({ opacity: 0 });

			var transitionEvent = whichTransitionEvent();
			$('.js-loading').one(transitionEvent, function() {
				App.debugging('Loading transition finished', 'report');

				$('.js-loading').remove(); //remove after transition has finished
			});
		}
	};


	App.loading = module;

}(App));