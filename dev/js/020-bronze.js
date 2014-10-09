var signals = [
	['signal1.jpg','To attract attention between a boat and the shore'],
	['signal2.jpg','Return to shore'],
	['signal3.jpg','Remain stationary'],
	['signal4.jpg','Message not clear, repeat'],
	['signal5.jpg','Pick up swimmers'],
	['signal6.jpg','Investigate submerged object'],
	['signal7.jpg','Proceed further out to sea'],
	['signal8.jpg','Go to the left or the right'],
	['signal9.jpg','Message understood, all clear'],
	['signal10.jpg','Pick up or adjust buoys'],
	['signal11.jpg','Assistance required'],
	['signal12.jpg','Boat wishes to return to shore'],
	['signal13.jpg','Emergency evacuation alarm (Water to beach)'],
	['signal14.jpg','Shore signal received and understood'],
	['signal15.jpg','Search completed'],
	['signal16.jpg','Emergency evacuation flag'],
	['signal17.jpg','Emergency evacuation alarm'],
	['signal18.jpg','Mass rescue'],
	['signal19.jpg','Helicopter signal—request to enter'],
	['signal20.jpg','Signal flag'],
	['signal21.jpg','Submerged Patient Missing'],
	['signal22.jpg','All Clear/OK']
];

function createPreload() {
	$.each(signals, function(i, v) {
		$(".js-reloader").append('<img src="img/' + v[0] + '">');
	});
}

function shuffle(array) {
	var counter = array.length, temp, index;

	while(counter > 0) {
		index = Math.floor(Math.random() * counter);

		counter--;

		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

function drawChoices(mode) {

	signals = shuffle(signals);

	if(mode === "imageName") {
		$(".js-choices").html("");
		$.each(signals, function(i, v) {
			$(".js-choices").append(
				'<li class="canvas-choices-item"><a class="js-choice canvas-choices-link" data-choice="' + i + '" href="#">' + v[1] + '</a></li>'
			);
		});
	}
	if(mode === "nameImage") {
		$(".js-choices").html("");
		$.each(signals, function(i, v) {
			$(".js-choices").append(
				'<li class="canvas-choices-item">' +
					'<a class="js-choice canvas-choices-link" data-choice="' + i + '" href="#">' +
						'<img class="canvas-choices-thumb" src="img/' + signals[ i ][0] + '">' +
					'</a>' +
				'</li>'
			);
		});
	}

}

function findNewSignal(signals) {
	var old = $(".js-question img").attr("src");
	var newSignal = Math.floor((Math.random()*22));
	var newPath = "img/" + signals[newSignal][0];

	if(old == newPath) return findNewSignal(signals);
	else return newSignal;
}

function newQuestion(mode, signals) {
	var signal =  findNewSignal(signals);

	drawChoices(mode)

	if(mode === "imageName") {
		$(".js-question").html(
			'<img class="question-img" src="img/' + signals[signal][0] + '">'
		).attr("data-answer", signal);
	}
	if(mode === "nameImage") {
		$(".js-question").html(
			'<h1 class="question-text">' + signals[ ( signal ) ][1] + '</h1>'
		).attr("data-answer", signal);
	}
}

function drawScore(score) {
	$(".js-score").html(
		'<h1 class="score-headline">Your Score: ' + ( score.yays - score.nays ) + '</h1>' +
		'<ul class="score">' +
			'<li class="score-item-left">yays: <strong>' + score.yays + '</strong></li>' +
			'<li class="score-item-middle"><a href="#" class="js-highscore">HIGHSCORE</a></li>' +
			'<li class="score-item-right">nays: <strong>' + score.nays + '</strong></li>' +
		'</ul>' +
		''
	);
}

function getScore() {
	$(".js-score-board").html("").addClass("is-loading");

	$.ajax({
		type: "POST",
		url: "php/ajax_lib.php",
		data: {
			action: "get"
		}
	})
	.done(function( msg ) {
		if(msg) $(".js-score-board").html(msg).removeClass("is-loading");
		else $(".js-score-board").html("- no scores yet -").removeClass("is-loading");
	});
}

function setScore() {

	$.ajax({
		type: "POST",
		url: "php/ajax_lib.php",
		data: {
			action: "set",
			name: $("#name").val(),
			score: $("#score").val(),
			nays: $("#nays").val()
		}
	})
	.done(function( msg ) {
		getScore();
	});

}

$(function() {
	if($('.js-signals').length) {
		/**********************************| CONSTRUCT |**********************************/
		var mode = $(".js-headnav-link.is-active").attr("data-mode");
		var score = {
			yays: 0,
			nays: 0,
			wrongs: []
		};

		drawChoices(mode);
		newQuestion(mode, signals);
		drawScore(score);
		createPreload();

		/**********************************| CHOICE |**********************************/
		$('.js-canvas').on('click', '.js-choice', function(e) {
			e.preventDefault();
			var $this = $(this);
			var correctAnswer = $('.js-question').attr("data-answer");
			var answer = $this.attr("data-choice");

			if( answer != correctAnswer ) {
				if(!$this.hasClass("is-incorrect")) {
					$this.addClass("is-incorrect");
					score.nays++;
					score.wrongs[signals[ answer ][1]] = (score.wrongs[signals[ answer ][1]] ? score.wrongs[signals[ answer ][1]] + 1 : 1);
				}
			}
			else {
				if(!$this.hasClass("is-correct")) {
					$this.addClass("is-correct");
					score.yays++;
				}
				$(".js-next").removeClass("is-hidden");
			}

			drawScore(score);
		});

		/**********************************| NEXT |**********************************/
		$('.js-canvas').on('click', '.js-next', function(e) {
			e.preventDefault();
			var mode = $(".js-headnav-link.is-active").attr("data-mode");

			$('.js-choice').removeClass("is-correct").removeClass("is-incorrect");
			$(".js-next").addClass("is-hidden");
			$("html, body").animate({ scrollTop: $(".js-question").offset().top }, 250);
			newQuestion(mode, signals);
		});

		/**********************************| CHANGE MODE |**********************************/
		$(".js-headnav-link").click(function() {
			$(".js-headnav-link").removeClass("is-active");
			$(this).addClass("is-active");
			$(".js-next").addClass("is-hidden");

			var mode = $(".js-headnav-link.is-active").attr("data-mode");

			drawChoices(mode);
			newQuestion(mode, signals);
		});

		/**********************************| HIGHSCORE POPUP |**********************************/
		$('.js-score').on('click','.js-highscore',function(e) {
			e.preventDefault();
			var popupOptions = {
				centered: true,
				overlaySpeed: 50,
				onClose: function() {
					$(".js-highscore-popup, .js_lb_overlay").remove();
				}
			}

			function bySortedValue(obj) {
				var tuples = [];
				var result = [];
				for(var key in obj) tuples.push([key, obj[key]]);
				tuples.sort(function(a, b) { return a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0 });
				var length = tuples.length;
				while(length--) {
					result.push('<i>' + tuples[length][0] + ' (' + tuples[length][1] + ' nays)</i><br>');
				}
				return result;
			}

			var wrongs = '';
			var i = 0;
			var wrongsSorted = bySortedValue(score.wrongs);
			for(var i = 1; i < (wrongsSorted.length >= 4 ? 4 : (wrongsSorted.length + 1)); i++) {
				wrongs += wrongsSorted[(wrongsSorted.length - i)];
			}

			$("<div/>")
				.addClass("js-highscore-popup")
				.css({ right: 0 })
				.html(
					'<div class="highscore">' +
					'<a href="#" class="js-close-overlay close-overlay">&times;</a>' +
					'<h1 class="highscore-headline">HIGHSCORE</h1>' +
					'<small class="js-form-below">' +
					'Your score: ' + ( score.yays - score.nays ) + ' <small class="nays" title="nays">(' + score.nays + ')</small>' +
					( score.nays > 0 ?
						'<br>You should do <strong>' + (score.nays * 10) + '</strong> push-ups!!' +
						'<br>And work on: <br>' + wrongs
					: '') +
					'</small>' +
					'<ol class="js-score-board score-board"></ol>' +
					'</div>'
				).appendTo("body");

			$('<form/>')
				.addClass("js-submit")
				.attr("action", "?")
				.attr("method", "POST")
				.html(
					'<input class="highscore-input" type="text" id="name" name="name" placeholder="Enter your name">' +
					'<input type="hidden" id="score" name="score" value="' + ( score.yays - score.nays ) + '">' +
					'<input type="hidden" id="nays" name="nays" value="' + score.nays + '">' +
					'<input type="submit" class="is-hidden" value="submit">'
				)
				.submit(function(e) {
					e.preventDefault();

					setScore();
					$(".js-submit").remove();
				})
				.insertAfter(".js-form-below");

			$("<div/>")
				.addClass("overlay js-close-overlay")
				.appendTo("body")
				.fadeOut(0)
				.fadeIn(200);

			getScore();
		});

		/**********************************| CLOSE HIGHSCORE |**********************************/
		$(document).on('click','.js-close-overlay',function(e) {
			$('.js-close-overlay, .js-highscore-popup').fadeOut(200, function() {
				$(this).remove();
			});
		});
	}
});