/***************************************************************************************************************************************************************
 *
 * Questions
 *
 **************************************************************************************************************************************************************/


(function(App) {

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// privat function: shuffle an array
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function shuffle(array) {
		var currentIndex = array.length;
		var temporaryValue;
		var randomIndex ;

		// While there remain elements to shuffle
		while(0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// privat function: render HTML depending on an option
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function renderView( item, option ) {
		var result = '';

		if(option === 'image') {
			result = '<img src="' + item.image + '" alt="question">'
		}
		else {
			result = '<h2>' + item.text + '</h2>'
		}

		return result;
	}


	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// get questions from REST API or localStorage
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function( callback ) {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Getting questions');

		if( QUESTIONS === undefined ) {
			App.loading.start( true );

			$.ajax({
				url: App.QUESTIONGET,
				dataType: 'json',
				timeout: App.TIMEOUT,
				success: function( data ) {
					if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Recived questions');

					store.set('questions', data);
					App.QUESTIONS = data;

					callback();
					App.loading.start( false );
				},
				error: function(jqXHR, status, errorThrown) {
					if(DEBUG) console.log('%c\u2612 ', 'color: red; font-size: 18px;', 'Question json errored out with: ' + status);
					App.questions.get( callback );
				}
			});
		}
		else {
			App.QUESTIONS = QUESTIONS;
		}

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// initiate game
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.init = function() {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Initiate questions');

		App.questions.get();
		App.scaffold.playground();
		App.questions.draw();

		$('.js-body').on('click', '.js-answer', function() {
			App.questions.answer( $(this) );
		});

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// draw next round
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.draw = function() {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Dawing questions');

		var QUESTIONS = shuffle( App.QUESTIONS );
		var AllQuestions = shuffle( store.get('questions') );

		var question = 'text';
		var answer = 'image';

		if( App.VIEW === 'P2T' ) {
			var question = 'image';
			var answer = 'text';
		}

		App.CORRECT = Math.floor( Math.random() * QUESTIONS.length );
		var questionHTML = renderView( QUESTIONS[ App.CORRECT ], question );
		$('.js-question').html( questionHTML );

		var answerHTML = '';

		$.each(AllQuestions, function( index, question ) {
			answerHTML += '<li class="answer">' +
				'	<button class="js-answer" data-id="' + index + '">' + renderView( question, answer ) + '</button>' +
				'</li>';
		});

		$('.js-answers').html( answerHTML );

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// click an answer
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.answer = function( $this ) {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Executing answer');

		console.log($this.attr('data-id'));

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// change view
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.view = function() {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Changing view');

		//

	};


	App.questions = module;

}(App));
