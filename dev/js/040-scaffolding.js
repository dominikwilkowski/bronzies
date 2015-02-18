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
		App.debugging('Scaffolding loading screen', 'report');

		$('.js-loading').remove(); //remove all previously opened loading screens

		var HTML = '<div class="js-loading loading">' +
			'	<div class="loading-wrapper">' +
			'		<h1 class="js-loading-animation loading-animation">Loading</h1>' +
			'	</div>' +
			'</div>';

		$('.js-body').prepend(HTML);
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// playground with everything we need for the game
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.playground = function() {
		App.debugging('Scaffolding playground', 'report');

		if( !$('.js-playground').length ) {
			var HTML = '<div class="js-splash splash is-animating">' +
				'	<div class="splash-wrapper">' +
				'		<img class="splash-logo" src="img/slsa-logo.png" alt="SLSA logo">' +
				'	</div>' +
				'</div>' +
				'<header class="header-wrapper">' +
				'	<ul class="header">' +
				'		<li>' +
				'			<button class="js-menubutton header-menu">' +
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
				'			<img class="logo" src="img/slsa-logo.png" alt="SLSA Logo">' +
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
				'		<ul class="js-menu menu is-invisible">' +
				'			<li>' +
				'				<button class="js-highscore menu-link">' +
				'					Highscore' +
				'				</button>' +
				'			</li>' +
				'			<li>' +
				'				<button class="js-about menu-link">' +
				'					About' +
				'				</button>' +
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
		App.debugging('Scaffolding highscore', 'report');

		var HTML = '<div class="js-popover highscore-wrapper is-invisible" data-id="highscore">' +
			'	<div class="highscore">' +
			'		<button class="js-popover-close" data-id="highscore">close</button>' +
			'		<h1 class="highscore-headline">Highscore</h1>' +
			'		<h4>' +
			'			Your score:' +
			'			<span class="js-score highscore-score">0</span>' +
			'			<span class="js-scorenay highscore-nays">0</span>' +
			'		</h4>' +
			'		<p class="js-highscore-blob highscore-blob"></p>' +
			'		<ul class="js-highscore-wrongs highscore-wrongs"></ul>' +
			'		<form class="js-form form" method="POST" action="' + App.HIGHSCOREPOST + '">' +
			'			<label for="name" class="form-label">Enter yourself into the Highscore</label>' +
			'			<input id="name" type="text" name="name" class="js-form-name form-name" placeholder="Your name">' +
			'			<span class="js-form-error"></span>' +
			'			<input class="js-form-nays" type="hidden" name="nays" value="0">' +
			'			<input class="js-form-score" type="hidden" name="score" value="0">' +
			'			<input class="js-form-date" type="hidden" name="date" value="' + new Date().toJSON() + '">' +
			'			<input type="submit" class="is-hidden" value="submit">' +
			'		</form>' +
			'		<ol class="js-highscores highscores"></ol>' +
			'	</div>' +
			'</div>' +
			'<div class="js-popover-screen popover-screen"></div>';

		$('.js-body').append(HTML);
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// about screen
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.about = function() {
		App.debugging('Scaffolding about', 'report');

		var HTML = '<div class="js-popover about-wrapper is-invisible" data-id="about">' +
			'	<div class="about">' +
			'		<button class="js-popover-close" data-id="about">close</button>' +
			'		<h1 class="about-headline">About</h1>' +
			'		<p class="about-blob">' +
			'			This app has been developed by <a href="http://dominik-wilkowski.com" target="_blank">Dominik Wilkowski</a>' +
			'			and designed my <a href="http://conley.com.au/">Dylan Conley</a>.' +
			'		</p>' +
			'		<p class="about-blob">' +
			'			Let me know if you <a href="https://github.com/dominikwilkowski/bronzies/issues" target="_blank">have any issues</a>.' +
			'		</p>' +
			'	</div>' +
			'</div>' +
			'<div class="js-popover-screen popover-screen"></div>';

		$('.js-body').append(HTML);
	};


	App.scaffold = module;

}(App));