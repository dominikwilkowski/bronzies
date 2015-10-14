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
			var HTML = '' +
				'<div class="js-splash splash is-animating">' +
				'	<div class="splash-wrapper">' +
				'		<svg class="splash-logo" aria-labelledby="title" viewBox="0 0 85 85">' +
				'			<title id="title" lang="en">SLSA logo</title>' +
				'			<use xlink:href="#logo"></use>' +
				'		</svg>' +
				'	</div>' +
				'</div>' +
				'<header class="header-wrapper js-header">' +
				'	<button class="js-switchview switch">' +
				'		<span class="switch-toggle">Switch view</span>' +
				'	</button>' +
				'	<svg class="logo-img" aria-labelledby="title" itemscope itemtype="http://schema.org/Organization" viewBox="0 0 85 85">' +
				'		<title id="title" lang="en">SLSA logo</title>' +
				'		<use xlink:href="#logo"></use>' +
				'	</svg>' +
				'	<button class="js-highscore highscore-link">' +
				'		<svg class="highscore-link-svg" aria-labelledby="title" viewBox="0 0 50 50">' +
				'			<title id="title" lang="en">Highscore</title>' +
				'			<use xlink:href="#highscore"></use>' +
				'		</svg>' +
				'	</button>' +
				'	<div class="progress-wrapper">' +
				'		<span class="progress-title">Progress</span>' +
				'		<ul class="js-progress progress"></ul>' +
				'		<div class="score">' +
				'			<span class="js-score score-count">0</span>' +
				'			<div class="score-yaynays">' +
				'				<span class="js-scoreyay score-yay">0</span>' +
				'				<span class="js-scorenay score-nay">0</span>' +
				'			</div>' +
				'		</div>' +
				'	</div>' +
				'</header>' +
				'<main class="playground js-main">' +
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
			'	<div class="js-popup-content popup-content highscore" id="test">' +
			'		<button class="js-popup-close popup-close" data-id="highscore">close</button>' +
			'		<h1 class="highscore-headline">Highscore</h1>' +
			'		<h4 class="highscore-mine">' +
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
	// animations
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.animations = function() {
		App.debugging('Scaffolding animations', 'report');

		var HTML = '<div class="animations-canvas js-animation">' +
			'	<svg class="animations-shark" aria-labelledby="title1" viewBox="0 0 79 54">' +
			'		<title id="title1" lang="en">Shark fin</title>' +
			'		<use xlink:href="#shark"></use>' +
			'	</svg>' +
			'	<svg class="animations-flags animations-flag1" aria-labelledby="title-flag1" viewBox="0 0 100 202">' +
			'		<title id="title-flag1" lang="en">Beach flag</title>' +
			'		<use xlink:href="#flag1"></use>' +
			'	</svg>' +
			'	<svg class="animations-flags animations-flag2" aria-labelledby="title-flag2" viewBox="0 0 74 223">' +
			'		<title id="title-flag2" lang="en">Beach flag</title>' +
			'		<use xlink:href="#flag2"></use>' +
			'	</svg>' +
			'	<div class="animations-ball-wrapper">' +
			'		<svg class="animations-ball" aria-labelledby="title-ball" viewBox="0 0 180 183">' +
			'			<title id="title-ball" lang="en">Ball</title>' +
			'			<use xlink:href="#ball"></use>' +
			'		</svg>' +
			'	</div>' +
			'	<svg class="animations-tube" aria-labelledby="title-tube" viewBox="0 0 286 66">' +
			'		<title id="title-tube" lang="en">Rescue tube</title>' +
			'		<use xlink:href="#tube"></use>' +
			'	</svg>' +
			'	<svg class="animations-irb" aria-labelledby="title-irb" viewBox="0 0 386.4 146.4">' +
			'		<title id="title-irb" lang="en">IRB</title>' +
			'		<use xlink:href="#irb"></use>' +
			'	</svg>' +
			'	<div class="animations-water">' +
			'		<svg class="animations-water-bubble" aria-labelledby="title-bubble" viewBox="0 0 180 183">' +
			'			<title id="title-bubble" lang="en">bubble</title>' +
			'			<use xlink:href="#bubble"></use>' +
			'		</svg>' +
			'		<svg class="animations-water-bubble" aria-labelledby="title-bubble" viewBox="0 0 180 183">' +
			'			<title id="title-bubble" lang="en">bubble</title>' +
			'			<use xlink:href="#bubble"></use>' +
			'		</svg>' +
			'		<svg class="animations-water-bubble" aria-labelledby="title-bubble" viewBox="0 0 180 183">' +
			'			<title id="title-bubble" lang="en">bubble</title>' +
			'			<use xlink:href="#bubble"></use>' +
			'		</svg>' +
			'		<svg class="animations-water-fish" aria-labelledby="title-fish" viewBox="0 0 244.1 159.3">' +
			'			<title id="title-fish" lang="en">fish</title>' +
			'			<use xlink:href="#fish"></use>' +
			'		</svg>' +
			'	</div>' +
			'</div>';

		$('.js-header').append(HTML);
	};


	// //------------------------------------------------------------------------------------------------------------------------------------------------------------
	// // about screen
	// //------------------------------------------------------------------------------------------------------------------------------------------------------------
	// module.about = function() {
	// 	App.debugging('Scaffolding about', 'report');

	// 	var HTML = '<div class="js-popup popup about-wrapper" data-id="about">' +
	// 		'	<div class="js-popup-screen popup-screen"></div>' +
	// 		'	<div class="js-popup-content popup-content about">' +
	// 		'		<button class="js-popup-close popup-close" data-id="about">close</button>' +
	// 		'		<h1 class="about-headline">About</h1>' +
	// 		'		<p class="about-blob">' +
	// 		'			This app has been developed by <a href="http://dominik-wilkowski.com" target="_blank">Dominik Wilkowski</a>' +
	// 		'			and designed my <a href="http://conley.com.au/">Dylan Conley</a>.' +
	// 		'		</p>' +
	// 		'		<p class="about-blob">' +
	// 		'			Let me know if you <a href="https://github.com/dominikwilkowski/bronzies/issues" target="_blank">have any issues</a>.' +
	// 		'		</p>' +
	// 		'	</div>' +
	// 		'</div>';

	// 	$('.js-body').append(HTML);
	// };


	App.scaffold = module;

}(App));