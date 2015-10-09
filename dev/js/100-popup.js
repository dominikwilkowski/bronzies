/***************************************************************************************************************************************************************
 *
 * Popup
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// initiate popups
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.init = function() {
		App.debugging( 'Initiate popups', 'report' );

		//click to close popup
		$('.js-body').on('click', '.js-popup-close, .js-popup-screen', function() {
			App.debugging('Popup close button or screen clicked', 'interaction');

			App.popup.open( '', false );
		});
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// open or close a popup
	//
	// id    string  Data-id of popup to open, we don't need an id to close it
	// open  boolen  Open popup?
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.open = function( id, open ) {
		App.debugging( ( open ? 'Opening ' : 'Closing ' ) + id + ' popup', 'report' );

		$('.js-popup').removeClass('is-visible'); //close all of them

		if(open) {
			var $target = $('.js-popup[data-id=\'' + id + '\']'); //get the popup you want to open

			$target.addClass('is-visible');
			$('.js-header, .js-main').addClass('is-blurry');
			$('.js-body').addClass('has-popup');
		}
		else {
			var $target = $('.js-popup'); //get all popup to close

			$target.removeClass('is-visible');
			$('.js-header, .js-main').removeClass('is-blurry');
			$('.js-body').removeClass('has-popup');
		}
	};


	App.popup = module;

}(App));