/***************************************************************************************************************************************************************
 *
 * Highscore
 *
 **************************************************************************************************************************************************************/


(function(App) {

	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// get highscore from REST API
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function( callback ) {
		App.debugging('Getting highscore', 'report');

		App.debugging('Shooting off Ajax', 'report'); //we shoot it off right away here

		App.loading.start( true );

		$.ajax({
			url: App.HIGHSCOREGET,
			dataType: 'json',
			timeout: App.TIMEOUT,
			success: function( data ) {
				App.debugging('Highscore recived', 'report');

				store.set('highscore', data); //save in localStorage

				if(callback instanceof Function) {
					callback();
				}

				App.loading.start( false );
			},
			error: function(jqXHR, status, errorThrown) {
				App.debugging('Highscore get json errored out with: ' + status, 'error');

				App.highscore.get( callback ); //just simply try again
			}
		});

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// initiate highscore
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.init = function() {
		App.debugging('Initiating highscore', 'report');

		App.scaffold.highscore();
		App.scaffold.about();
		App.progress.draw();


		//click menu button
		$('.js-body').on('click', '.js-menubutton', function() {
			App.debugging('Menu button clicked', 'interaction');

			$('.js-menu').toggleClass('is-invisible');
		});


		//click highscore button
		$('.js-body').on('click', '.js-highscore', function() {
			App.debugging('Highscore button clicked', 'interaction');

			App.popup.open( 'highscore', true );

			App.highscore.get(function() {
				App.highscore.draw();
			});
		});


		//click about button
		$('.js-body').on('click', '.js-about', function() {
			App.debugging('About button clicked', 'interaction');

			App.popup.open( 'about', true );
		});


		//click popover close button
		$('.js-body').on('click', '.js-popover-close', function() {
			App.debugging('Menu button clicked', 'interaction');

			var target = $(this).attr('data-id');

			App.popup.open( target, false );
		});


		//submit new highscore
		$('.js-body').on('submit', '.js-form', function(e) {
			e.preventDefault();

			App.highscore.post( $(this).serialize(), function() {
				App.highscore.draw();
			});
		});

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// draw highscore
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.draw = function() {
		App.debugging('Dawing highscore', 'report');

		HIGHSCORE = store.get('highscore');

		var highscoreHTML = '';

		//render highscore rows
		$.each(HIGHSCORE, function( index, score ) {
			highscoreHTML += '<li class="js-highscores-item highscores-item' + ( score.justadded ? ' is-active' : '' ) + '">' +
				'	<span class="highscores-name">' + score.name + '</span>' +
				'	<span class="highscores-score">' + score.score + '</span>' +
				'	<span class="highscores-nays">' + score.nays + '</span>' +
				'</li>';
		});

		//building highscore blob
		var tuples = [];
		var HTML = '';
		var i = 0;

		var pushups = (10 * App.NAYS) - (5 * App.YAYS); //push ups calculation

		HTML += '<p><em class="highscore-blob-pushups">' +
			'	According to your score you should be doing ' + pushups + ' push ups!' +
			'</em></p>';


		if( App.NAYS > 0 ) { //only show if we actually have some wrongs
			HTML += '<h5 class="highscore-blob-headline">Questions you got wrong most frequently</h5>';
		}

		HTML += '<ul class="highscore-blob-wrongs">';

		for(var key in App.WRONGS) { //we have to create an array from the object we populate
			tuples.push([key, App.WRONGS[key]]);
		}

		tuples.sort(function(a, b) { //then we sort it by one of it's value
			return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0
		});

		for(var i = 0; i < tuples.length; i++) { //build the HTML
			HTML += '	<li>' + tuples[i][0] + ' (' + tuples[i][1] + ' nays)</li>';

			if( i >= 4 ) { //show a max of 5
				break;
			}
		};

		HTML += '</ul>'


		$('.js-highscore-blob').html( HTML );

		$('.js-highscores').html( highscoreHTML );
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// add to highscore
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.update = function( win ) {
		App.debugging('Updating highscore', 'report');

		var score = App.YAYS - App.NAYS; //simple enough, try to cheat THAT!

		//update score in header
		$('.js-scoreyay').text( App.YAYS );
		$('.js-scorenay').text( App.NAYS );
		$('.js-score').text( score );

		//update score in form
		$('.js-form-nays').val( App.NAYS );
		$('.js-form-score').val( score );

		App.progress.update( win );
	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// post new highscore
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.post = function( submitData, callback ) {
		App.debugging('Posting highscore', 'report');

		var _hasName = $('.js-form-name').val() != '';
		submitData += '--' + new Date().toJSON(); //add end date

		if( _hasName ) {
			App.debugging('Shooting off Ajax', 'report');

			$('.js-form-error').html(''); //clear errors
			App.loading.start( true );

			$.ajax({
				url: App.HIGHSCOREPOST,
				dataType: 'json',
				type: 'POST',
				data: submitData,
				timeout: App.TIMEOUT,
				success: function( data ) {
					App.debugging('Highscore recived', 'report');

					store.set('highscore', data); //save to localStorage

					$('.js-form-name').val(''); //go again if you want... double post protection?

					if(callback instanceof Function) {
						callback();
					}

					App.loading.start( false );
				},
				error: function(jqXHR, status, errorThrown) {
					App.debugging('Highscore post json errored out with: ' + status, 'error');

					App.highscore.post( submitData, callback ); //try again... pretty please?
				}
			});
		}
		//you gotta provide a name for the highscore, anything...
		else {
			App.debugging('No username given', 'error');

			var HTML = '<p class="form-error">Can\'t add you to the highscore without a name...</p>';

			$('.js-form-error').html( HTML );
		}

	};


	App.highscore = module;

}(App));