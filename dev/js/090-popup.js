/***************************************************************************************************************************************************************
 *
 * Popup
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// open or close a popup
	//
	// id    string  Data-id of popup to open/close
	// open  boolen  Open popup?
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.open = function( id, open ) {
		App.debugging( ( open ? 'Opening ' : 'Closing ' ) + id + ' popup', 'report' );

		var $target = $('.js-popover[data-id=\'' + id + '\']'); //get the popup you want to open

		$('.js-popover').addClass('is-invisible'); //close all of them

		if(open) {
			$target.removeClass('is-invisible');
		}
		else {
			$target.addClass('is-invisible');
		}
	};


	App.popup = module;

}(App));