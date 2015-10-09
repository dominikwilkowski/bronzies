/***************************************************************************************************************************************************************
 *
 * Loading
 *
 **************************************************************************************************************************************************************/


(function(App) {

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

			var transitionEvent = App.whichTransitionEvent();
			$('.js-loading').one(transitionEvent, function() {
				App.debugging('Loading transition finished', 'report');

				$('.js-loading').remove(); //remove after transition has finished
			});
		}
	};


	App.loading = module;

}(App));