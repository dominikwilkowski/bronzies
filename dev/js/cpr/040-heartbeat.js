/***************************************************************************************************************************************************************
 *
 * Heartbeat animation
 *
 **************************************************************************************************************************************************************/


(function(CPR) {

	var module = {};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// private function: one beat
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function beat() {
		CPR.debugging('Heartbeat: running beat', 'report');

		var $heart = $('.js-heart');

		$heart.removeClass('has-animation'); //remove old animation
		void $heart.height(); //trigger draw
		$heart.addClass('has-animation'); //start new animation

		if( CPR.SOUND ) {
			lowLag.play('heartbeat');
		}
	}


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// loading screen
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.init = function() {
		CPR.debugging('Heartbeat: initiating', 'report');

		lowLag.init({
			debug: 'none',
			audioTagTimeToLive: 1000,
		});

		lowLag.load([ //load all versions at once for best coverage
			'media/heartbeat.mp3',
			'media/heartbeat.ogg',
			'media/heartbeat.m4a',
			'media/heartbeat.wav',
			],
			'heartbeat');

		setInterval(beat, CPR.SPEED);

		// button event listener
		$('.js-mute').on('click', function() {
			CPR.debugging('Heartbeat: mute button clicked', 'interaction');

			lowLag.play('heartbeat'); //we need this because iOS otherwise blocks us from playing anything...

			$(this).toggleClass('is-muted'); //toggle the waves on and off

			CPR.SOUND = !CPR.SOUND; //toggle the sound
		});
	};


	CPR.heartbeat = module;

}(CPR));