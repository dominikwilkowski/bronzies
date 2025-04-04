import { convertQuestions } from "../../../server/utils.js";

describe("The history", () => {
	beforeEach(() => {
		cy.fixture("highscore-staging.json").as("highscore");
		cy.fixture("signals-staging.json").as("signals");
		cy.visit("http://localhost:3000");
	});

	it("should keep track of the wrong answers", function () {
		// getting data from our fixtures
		const SIGNALS = convertQuestions(this.signals);
		const QUESTIONS = this.signals;
		const HIGHSCORE = this.highscore;
		// some hoisting of variables so our (fake) promises have access to them
		let $title;
		let questionID;
		let answerText;
		let correct;
		let wrongs;
		let score = 0;
		let position = 0;
		const wrongAnswers = [];

		cy
			// go into highscore
			.get("a[data-highscore]")
			.realClick()
			// check that there are no user sections yet
			.get("p[data-most-wrong]")
			.should("not.exist")
			.get("form[data-input-form]")
			.should("not.exist")
			.root()
			.should("contain", "Latest entries")
			.root()
			.should("contain", `Total: ${HIGHSCORE.length}`)
			.root()
			.should("contain", "Score board")
			.root()
			.should("contain", "Top 50")
			// go back to game
			.get("a")
			.contains("Go back to the game")
			.realClick()
			// getting the current question from the DOM
			.then(() => {
				return cy.get('[data-question="true"] title').should("exist");
			})
			.then(($title) => {
				questionID = "#" + $title.attr("id").replace("-title", "");
				answerText = SIGNALS[questionID].text;
				correct = new RegExp(`^(${answerText})$`, "g");
				// correct answer
				cy.get("[data-answer]").contains(correct).realClick();
			})
			// next question
			.get('button[data-cy-id="Next question"]', { timeout: 60000 })
			.filter(":visible")
			.realClick()
			// go into highscore
			.get("a[data-highscore]")
			.realClick()
			// check what's displayed
			.get("p[data-most-wrong]")
			.should("not.exist")
			.get("form[data-input-form]")
			.should("be.visible")
			.root()
			.contains("pushups")
			.should("not.exist")
			// go back to game
			.get("a")
			.contains("Go back to the game")
			.realClick()
			// getting the current question from the DOM
			.then(() => {
				return cy.get('[data-question="true"] title').should("exist");
			})
			.then(($title) => {
				questionID = "#" + $title.attr("id").replace("-title", "");
				answerText = SIGNALS[questionID].text;
				correct = new RegExp(`^(${answerText})$`, "g");
				wrongs = new RegExp(`^(?!${answerText}$).*$`, "gm");
				// wrong answer
				wrongAnswers.push(answerText);
				cy.get('[data-answer=""]').contains(wrongs).realClick();
			})
			// go into highscore
			.get("a[data-highscore]")
			.realClick()
			.get("p[data-most-wrong]")
			.should("be.visible")
			.get("form[data-input-form]")
			.should("be.visible")
			.root()
			.contains(" 5 pushups")
			.should("be.visible")
			// go back to game
			.get("a")
			.contains("Go back to the game")
			.realClick()
			// correct answer
			.then(() => {
				cy.get("[data-answer]").contains(correct).realClick();
			})
			// next question
			.get('button[data-cy-id="Next question"]', { timeout: 60000 })
			.filter(":visible")
			.realClick()
			// getting the current question from the DOM
			.then(() => {
				return cy.get('[data-question="true"] title').should("exist");
			})
			.then(($title) => {
				questionID = "#" + $title.attr("id").replace("-title", "");
				answerText = SIGNALS[questionID].text;
				correct = new RegExp(`^(${answerText})$`, "g");
				wrongs = new RegExp(`^(?!${answerText}$).*$`, "gm");
				// wrong answer
				wrongAnswers.push(answerText);
				cy.get('[data-answer=""]').contains(wrongs).realClick();
			})
			// correct answer
			.then(() => {
				cy.get("[data-answer]").contains(correct).realClick();
			})
			// next question
			.get('button[data-cy-id="Next question"]', { timeout: 60000 })
			.filter(":visible")
			.realClick()
			// getting the current question from the DOM
			.then(() => {
				return cy.get('[data-question="true"] title').should("exist");
			})
			.then(($title) => {
				questionID = "#" + $title.attr("id").replace("-title", "");
				answerText = SIGNALS[questionID].text;
				correct = new RegExp(`^(${answerText})$`, "g");
				wrongs = new RegExp(`^(?!${answerText}$).*$`, "gm");
				// wrong answer
				wrongAnswers.push(answerText);
				cy.get('[data-answer=""]').contains(wrongs).realClick();
			})
			// correct answer
			.then(() => {
				cy.get("[data-answer]").contains(correct).realClick();
			})
			// next question
			.get('button[data-cy-id="Next question"]', { timeout: 60000 })
			.filter(":visible")
			.realClick()
			// getting the current question from the DOM
			.then(() => {
				return cy.get('[data-question="true"] title').should("exist");
			})
			.then(($title) => {
				questionID = "#" + $title.attr("id").replace("-title", "");
				answerText = SIGNALS[questionID].text;
				correct = new RegExp(`^(${answerText})$`, "g");
				wrongs = new RegExp(`^(?!${answerText}$).*$`, "gm");
				// wrong answer
				wrongAnswers.push(answerText);
				cy.get('[data-answer=""]').contains(wrongs).realClick();
			})
			// correct answer
			.then(() => {
				cy.get("[data-answer]").contains(correct).realClick();
			})
			// next question
			.get('button[data-cy-id="Next question"]', { timeout: 60000 })
			.filter(":visible")
			.realClick()
			// getting the current question from the DOM
			.then(() => {
				return cy.get('[data-question="true"] title').should("exist");
			})
			.then(($title) => {
				questionID = "#" + $title.attr("id").replace("-title", "");
				answerText = SIGNALS[questionID].text;
				correct = new RegExp(`^(${answerText})$`, "g");
				wrongs = new RegExp(`^(?!${answerText}$).*$`, "gm");
				// wrong answer
				wrongAnswers.push(answerText);
				cy.get('[data-answer=""]').contains(wrongs).realClick();
			})
			// go into highscore
			.get("a[data-highscore]")
			.realClick()
			// check that the wrongs have been noted
			.then(() => {
				cy.get("ul[data-most-wrong-list]")
					.should("contain", wrongAnswers[0])
					.get("ul[data-most-wrong-list]")
					.should("contain", wrongAnswers[1])
					.get("ul[data-most-wrong-list]")
					.should("contain", wrongAnswers[2])
					.get("ul[data-most-wrong-list]")
					.should("contain", wrongAnswers[3])
					.get("ul[data-most-wrong-list]")
					.should("contain", wrongAnswers[4]);
			})
			// check for right pushup count (5*5)
			.root()
			.contains("25 pushups")
			.should("be.visible");
	});
});
