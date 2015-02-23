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
				'<header class="header-wrapper js-header">' +
				'	<button class="js-menubutton header-menu">' +
				'		Open menu' +
				'		<span class="header-button-l"></span>' +
				'		<span class="header-button-l"></span>' +
				'		<span class="header-button-l"></span>' +
				'	</button>' +
				'	<nav class="menu-wrapper">' +
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
				'	<img class="logo-img" itemscope itemtype="http://schema.org/Organization" src="img/slsa-logo.png" alt="SLSA Logo">' +
				'	<h1 class="logo">Bronzies</h1>' +
				'	<ul class="header">' +
				'		<li>' +
				'			<button class="js-switchview nav-view">Switch view</button>' +
				'		</li>' +
				'		<li>' +
				'			<div class="score">' +
				'				<strong class="score-text">Score</strong>' +
				'				<span class="js-score score-count">0</span>' +
				'				<div class="score-yaynays">' +
				'					<span class="js-scoreyay score-yay">0</span>' +
				'					<span class="js-scorenay score-nay">0</span>' +
				'				</div>' +
				'			</div>' +
				'		</li>' +
				'	</ul>' +
				'	<div class="progress-wrapper">' +
				'		<span class="progress-title">Progress</span>' +
				'		<ul class="js-progress progress"></ul>' +
				'	</div>' +
				'</header>' +
				'<main class="playground js-main">' +
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

		var HTML = '<div class="js-popup popup highscore-wrapper" data-id="highscore">' +
			'	<div class="js-popup-screen popup-screen"></div>' +
			'	<div class="popup-content highscore">' +
			'		<button class="js-popup-close popup-close" data-id="highscore">close</button>' +
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
			'</div>';

		$('.js-body').append(HTML);
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// about screen
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.about = function() {
		App.debugging('Scaffolding about', 'report');

		var HTML = '<div class="js-popup popup about-wrapper" data-id="about">' +
			'	<div class="js-popup-screen popup-screen"></div>' +
			'	<div class="popup-content about">' +
			'		<button class="js-popup-close popup-close" data-id="about">close</button>' +
			'		<h1 class="about-headline">About</h1>' +
			'		<p class="about-blob">' +
			'			This app has been developed by <a href="http://dominik-wilkowski.com" target="_blank">Dominik Wilkowski</a>' +
			'			and designed my <a href="http://conley.com.au/">Dylan Conley</a>.' +
			'		</p>' +
			'		<p class="about-blob">' +
			'			Let me know if you <a href="https://github.com/dominikwilkowski/bronzies/issues" target="_blank">have any issues</a>.' +
			'		</p>' +
			'	</div>' +
			'</div>';

		$('.js-body').append(HTML);
	};


	App.scaffold = module;

}(App));