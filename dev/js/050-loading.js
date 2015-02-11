/***************************************************************************************************************************************************************
 *
 * Loading
 *
 **************************************************************************************************************************************************************/


(function(App) {

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// privat function: what transistion prefix is supported in this browser?
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
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.start = function( start ) {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Loading ' + (start ? 'started' : 'stopped') );

		if(start) {
			App.scaffold.loading();

			$('.js-loading').css({ opacity: 0 }).css({ opacity: 1 });
		}
		else {
			$('.js-loading').css({ opacity: 0 });

			var transitionEvent = whichTransitionEvent();
			$('.js-loading').one(transitionEvent, function() {
				if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Loading transition finished');

				$('.js-loading').remove();
			});
		}
	};


	App.loading = module;

}(App));