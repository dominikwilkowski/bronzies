/***************************************************************************************************************************************************************
 *
 * Popup
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	//----------------------------------------------------------------------------------------------------------------------------------------------------------
	// throttle function
	//
	// @param   func       [function]  Function to be executed
	// @param   wait       [integer]   Run as much as possible without ever going more than once per [n in milliseconds] duration
	//
	// @return  [function]
	//----------------------------------------------------------------------------------------------------------------------------------------------------------
	function throttle(func, wait) {
		App.debugging( 'Base: Throttle called', 'report' );

		wait || (wait = 250);
		var last;
		var deferTimer;

		return function() {
			var context = this;
			var now = +new Date;
			var args = arguments;

			if(last && now < last + wait) {
				clearTimeout(deferTimer);

				deferTimer = setTimeout(function() {
					App.debugging( 'Base: Throttle executed (1)', 'report' );

					last = now;
					func.apply(context, args);
				}, wait);
			}
			else {
				App.debugging( 'Base: Throttle executed (2)', 'report' );

				last = now;
				func.apply(context, args);
			}
		};
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// private function: Check position
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function checkPos() {
		App.debugging( 'Scroll: Running checkPos', 'report' );

		var scroll = $(window).scrollTop();

		if(scroll > 74) {
			// App.debugging( 'Scroll: checkPos: Passed 89px', 'report' );

			$('.js-body').addClass('is-scrolled');
		}
		else {
			// App.debugging( 'Scroll: checkPos: Below 89px', 'report' );

			$('.js-body').removeClass('is-scrolled');
		}
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// initiate popups
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.init = function() {
		App.debugging( 'Scroll: Initiating', 'report' );

		//////////////////////////////////////////////////| SCROLL THROTTLER
		$(window).on('scroll', throttle(checkPos, 15) );

		checkPos();
	};


	App.scroll = module;

}(App));