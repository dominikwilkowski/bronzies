/***************************************************************************************************************************************************************
 *
 * Progress
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// draw progress
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.draw = function() {
		App.debugging('Drawing progress', 'report');

		var roundSteps = store.get('questions').length;
		var HTML = '';

		//render the progress dots
		for(var i = roundSteps - 1; i >= 0; i--) {
			HTML += '<li class="js-progress-step nav-progress-step">question</li>';
		};

		$('.js-progress').html( HTML );
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// update progress
	//
	// win  boolen  Correct answer?
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.update = function( win ) {
		App.debugging('Updating progress', 'report');

		var $thisStep = $('.js-progress-step.is-active'); //current question
		var _hasWrong = $thisStep.hasClass('is-wrong');

		if( win && !_hasWrong ) { //if it was a win and hasn't been answered wrong before
			$thisStep.addClass('is-right');
		}
		else {
			$thisStep.addClass('is-wrong');
		}
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// next progress
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.next = function() {
		App.debugging('Select next progress', 'report');

		var roundSteps = store.get('questions').length;
		var processSteps = $('.js-progress li').length;

		if( roundSteps !== processSteps ) { //if the progress steps are unequal to the localStorage steps (background sync)
			App.progess.draw();
		}

		var thisRoundSteps = App.QUESTIONS.length;
		var currentStep = roundSteps - thisRoundSteps;
		var $thisStep = $('.js-progress-step:eq(' + currentStep + ')');

		$('.js-progress-step').removeClass('is-active');
		$thisStep.addClass('is-active'); //mark current progress dot

	};


	App.progress = module;

}(App));