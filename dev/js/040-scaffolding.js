/***************************************************************************************************************************************************************
 *
 * Scaffolding HTML
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// loading screen
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.loading = function() {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Scaffolding loading screen');

		$('.js-loading').remove();

		var HTML = '<div class="js-loading loading">' +
			' <div class="loading-wrapper">' +
			'	 <img class="loading-logo" src="img/slsa-logo.png" alt="SLSA logo">' +
			'	 <h1 class="js-loading-animation is-loading-animation">Loading</h1>' +
			' </div>' +
			'</div>';

		$('.js-body').prepend(HTML);
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// playground with everything we need for the game
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.playground = function() {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Scaffolding playground');

		if( !$('.js-playground').length ) {
			var HTML = '<header class="header-wrapper">' +
				'	<ul class="header">' +
				'		<li>' +
				'			<button class="js-menu header-menu">' +
				'				Open menu' +
				'				<span class="header-button-l"></span>' +
				'				<span class="header-button-l"></span>' +
				'				<span class="header-button-l"></span>' +
				'			</button>' +
				'		</li>' +
				'		<li>' +
				'			<span class="js-score header-score">0</span>' +
				'			<span class="js-scoreyay header-scoreyay">0</span>' +
				'			<span class="js-scorenay header-scorenay">0</span>' +
				'		</li>' +
				'		<li>' +
				'			<img src="img/slsa-logo.png" alt="SLSA Logo">' +
				'		</li>' +
				'	</ul>' +
				'	<nav class="nav-wrapper">' +
				'		<ul class="nav">' +
				'			<li>' +
				'				<button class="js-switchview nav-view">Switch view</button>' +
				'			</li>' +
				'			<li>' +
				'				<span class="nav-progresstitle">Progress</span>' +
				'				<ul class="js-progress nav-progress"></ul>' +
				'			</li>' +
				'		</ul>' +
				'	</nav>' +
				'</header>' +
				'<main class="playground">' +
				'	<button class="js-next next is-hidden">Next question</button>' +
				'	<div class="js-question question"></div>' +
				'	<ul class="js-answers answers"></ul>' +
				'</main>';

			$('.js-body').append(HTML);
		}
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// highscore screen
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.highscore = function() {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Scaffolding highscore');
	};


	App.scaffold = module;

}(App));