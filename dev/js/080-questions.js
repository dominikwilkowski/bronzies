/***************************************************************************************************************************************************************
 *
 * Questions
 *
 **************************************************************************************************************************************************************/


(function(App) {

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// private function: shuffle an array
	//
	// array  [array]  Array to be shuffled
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function shuffle( array ) {
		var currentIndex = array.length;
		var temporaryValue;
		var randomIndex;

		//while there remain elements to shuffle
		while(0 !== currentIndex) {

			//pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			//and swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// private function: limit answers
	//
	// array  [array]  Array of answers to be limited
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function limit( answers ) {
		var answerCount = 0;

		var newAnswers = [];

		$.each(answers, function( index, question ) {
			if( question._id !== App.CORRECT && answerCount < ( App.ANSWERS - 1 ) ) { //get wrong answers to mix in
				newAnswers.push( question );

				answerCount++;
			}

			if( question._id === App.CORRECT ) { //add correct answer
				newAnswers.push( question );
			}
		});

		return newAnswers;
	}


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// private function: render question HTML
	//
	// item    [object]  Question object
	// option  [string]  Option to display the object as either text or image: image,text
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	function renderView( item, option ) {
		var result = '';

		//image
		if(option === 'image') {
			result = '<div class="signals ' + item.image + '"></div>';
		}
		//other, likely text
		else {
			result = item.text;
		}

		return result;
	}


	var module = {};

	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// get questions from REST API or localStorage
	//
	// background  [boolen]    Is this to be done in the background?
	// callback    [function]  Callback function
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.get = function( background, callback ) {
		App.debugging('Getting questions' + ( background ? ' in the background' : '' ), 'report');

		var QUESTIONS = store.get('questions');

		if( QUESTIONS === undefined || background ) { //if we haven't got anything in localStorage or this is a background task
			if( !background ) App.debugging('No data found in localStorage, requesting now', 'error');

			if(!background) { //don't show the loading screen if this is a background task
				App.loading.start( true );
			}

			$.ajax({
				url: App.QUESTIONGET,
				dataType: 'json',
				timeout: App.TIMEOUT,
				success: function( data ) {
					App.debugging('Questions recived', 'report');

					store.set('questions', data); //set in localStorage
					App.QUESTIONS = data;

					if(callback instanceof Function) {
						callback();
					}

					App.loading.start( false ); //close loading (even if we haven't started one)
				},
				error: function(jqXHR, status, errorThrown) {
					App.debugging('Question get json errored out with: ' + status, 'error');

					App.questions.get( false, callback ); //if timeout has been reached, just try again...
				}
			});
		}
		else {
			App.debugging('Getting questions from database', 'report');

			App.QUESTIONS = store.get('questions'); //get from localStorage

			if( App.QUESTIONS.length < 1 ) {
				App.debugging('No questions in storage', 'error');
			}

			if(callback instanceof Function) {
				callback();
			}
		}

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// initiate game
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.init = function() {
		App.debugging('Initiating questions', 'report');

		//click an answer
		$('.js-body').on('click', '.js-answer', function() {
			App.debugging('Answer clicked', 'interaction');

			App.questions.answer( $(this) );
		});


		//click next button
		$('.js-body').on('click', '.js-next', function() {
			App.debugging('Next button clicked', 'interaction');

			$('html, body').animate({ scrollTop: 100 }, 250);
			App.questions.draw();
		});


		//click switch button
		$('.js-body').on('click', '.js-switchview', function() {
			App.debugging('Switch button clicked', 'interaction');

			$(this).toggleClass('is-t2p');
			App.questions.view();
		});

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// draw next step
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.draw = function() {
		App.debugging('Dawing questions', 'report');

		// $('.js-next').addClass('is-offcanvas');

		// new round, all questions in this round have been asked, starting all over
		if( App.QUESTIONS.length < 1 && store.get('questions').length > 0 ) {
			App.debugging('Starting new round', 'report');

			App.questions.get( false, function() {
				App.progress.draw();
				App.questions.draw();
			});
		}

		//same round
		else {
			App.debugging('Drawing same round', 'report');

			App.progress.next();

			//shuffle everything
			var questionRound = shuffle( App.QUESTIONS );
			var AllQuestions = shuffle( store.get('questions') );

			//determine the view
			var questionView = App.VIEW === 'P2T' ? 'image' : 'text';
			var answerView = App.VIEW === 'P2T' ? 'text' : 'image';

			//pick a question from this round
			App.PICK = Math.floor( Math.random() * questionRound.length );
			App.CORRECT = questionRound[ App.PICK ]._id;
			App.PICKTEXT = questionRound[ App.PICK ].text

			//limit answers
			var LimitedQuestions = shuffle( limit( AllQuestions ) );

			var questionHTML = renderView( questionRound[ App.PICK ], questionView );
			$('.js-question').html( questionHTML );

			//render all answers
			var answerHTML = '';

			$.each(LimitedQuestions, function( index, question ) {
				answerHTML += '<li class="answers-item">' +
					'	<button class="js-answer answer" data-id="' + question._id + '">' + renderView( question, answerView ) + '</button>' +
					'	<button class="js-next next is-offcanvas"><span class="next-text">Next question</span></button>' +
					'</li>';
			});

			$('.js-answers').html( answerHTML );
		}

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// click an answer
	//
	// $this  [jQuery-object]  DOM node of answer clicked on
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.answer = function( $this ) {
		App.debugging('Executing answer', 'report');

		var answerID = $this.attr('data-id'); //the clicked answer
		var question = App.PICKTEXT; //the current question text for wrongs

		//correct
		if( answerID == App.CORRECT ) {
			App.debugging('Correct answer chosen', 'report');

			//YAY!
			App.YAYS++;
			App.highscore.update( true );

			$('.js-answer').attr('disabled', 'disabled'); //disable the rest to make it clear you can go to the next question

			App.QUESTIONS.splice(App.PICK, 1); //remove from this round

			$this.addClass('is-correct');
			$this.next('.js-next').removeClass('is-offcanvas');
		}
		//wrong
		else {
			App.debugging('Wrong answer chosen: id:' + answerID + ' correct:' + App.CORRECT, 'error');

			//Nooooo!
			App.NAYS++;
			App.WRONGS[question] = App.WRONGS[question] > 0 ? App.WRONGS[question] + 1 : 1; //increment this questions to be wrongly answered
			App.highscore.update( false );

			$this.addClass('is-wrong');
		}

	};


	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	// change view
	//------------------------------------------------------------------------------------------------------------------------------------------------------------
	module.view = function() {
		App.debugging('Changing view', 'report');

		App.VIEW = App.VIEW === 'P2T' ? 'T2P' : 'P2T'; //simple thing to do...
		App.questions.draw();
	};


	App.questions = module;

}(App));