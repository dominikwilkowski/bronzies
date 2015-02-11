/***************************************************************************************************************************************************************
 *
 * Loading
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// draw progress
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.draw = function() {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Draw progress');

		var roundSteps = store.get('questions').length;
		var HTML = '';

		for(var i = roundSteps - 1; i >= 0; i--) {
			HTML += '<li class="js-progress-step nav-progress-step">question</li>';
		};

		$('.js-progress').html( HTML );
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// update progress
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.update = function( win ) {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Update progress');

		var roundSteps = store.get('questions').length;
		var processSteps = $('.js-progress li').length;

		if( roundSteps !== processSteps ) { //if the progress steps are unequal to the json steps
			App.progess.draw();
		}

		var thisRoundSteps = App.QUESTIONS.length;
		var currentStep = roundSteps - thisRoundSteps;
		var $thisStep = $('.js-progress-step:eq(' + currentStep + ')');
		var _hasWrong = $thisStep.hasClass('is-wrong');

		if( win && !_hasWrong ) {
			$thisStep.addClass('is-right');
		}
		else {
			$thisStep.addClass('is-wrong');
		}
	};


	App.progress = module;

}(App));