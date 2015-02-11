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
			if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Shooting off Ajax');

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
			if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Shooting off to database');

			App.QUESTIONS = store.get('questions');
			callback();
		}

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// initiate game
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.init = function() {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Initiate questions');

		App.scaffold.playground();
		App.progress.draw();
		App.questions.get(function(){
			App.questions.draw();
		});

		//click an answer
		$('.js-body').on('click', '.js-answer', function() {
			App.questions.answer( $(this) );
		});

		//click next button
		$('.js-body').on('click', '.js-next', function() {
			App.questions.draw();
		});

		//click switch button
		$('.js-body').on('click', '.js-switchview', function() {
			App.questions.view();
		});

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// draw next step
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.draw = function() {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Dawing questions');

		$('.js-next').addClass('is-hidden');

		// new round
		if( App.QUESTIONS.length < 1 ) {
			if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Starting new round');

			App.questions.get(function() {
				App.progress.draw();
				App.questions.draw();
			});
		}

		//same round
		else {
			if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Drawing');

			var questionRound = shuffle( App.QUESTIONS );
			var AllQuestions = shuffle( store.get('questions') );

			var question = App.VIEW === 'P2T' ? 'image' : 'text';
			var answer = App.VIEW === 'P2T' ? 'text' : 'image';

			App.PICK = Math.floor( Math.random() * questionRound.length );
			App.CORRECT = questionRound[ App.PICK ].id;

			var questionHTML = renderView( questionRound[ App.PICK ], question );
			$('.js-question').html( questionHTML ).attr('data-text', questionRound[ App.PICK ].text);

			var answerHTML = '';

			$.each(AllQuestions, function( index, question ) {
				answerHTML += '<li class="answer">' +
					'	<button class="js-answer" data-id="' + question.id + '">' + renderView( question, answer ) + '</button>' +
					'</li>';
			});

			$('.js-answers').html( answerHTML );
		}

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// click an answer
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.answer = function( $this ) {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Executing answer');

		var answerID = $this.attr('data-id');
		var question = $('.js-question').attr('data-text');

		//correct
		if( answerID == App.CORRECT ) {
			if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Correct answer chosen');

			App.YAYS++;
			App.highscore.update();

			$('.js-answer').attr('disabled', 'disabled');

			App.QUESTIONS.splice(App.PICK, 1); //remove from this round

			$this.addClass('is-correct');
			$('.js-next').removeClass('is-hidden');
		}
		//wrong
		else {
			if(DEBUG) console.log('%c\u2612 ', 'color: red; font-size: 18px;', 'Wrong answer chosen: id:' + answerID + ' correct:' + App.CORRECT);

			App.NAYS++;
			App.WRONGS[question] = App.WRONGS[question] > 0 ? App.WRONGS[question] + 1 : 1;
			App.highscore.update();

			$this.addClass('is-wrong');
		}

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// change view
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.view = function() {
		if(DEBUG) console.log('%c\u2611 ', 'color: green; font-size: 18px;', 'Changing view');

		App.VIEW = App.VIEW === 'P2T' ? 'T2P' : 'P2T';
		App.questions.draw();

	};


	App.questions = module;

}(App));
