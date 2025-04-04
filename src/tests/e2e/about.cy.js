describe("The about page", () => {
	it("should include a link to submit issues and author reference", function () {
		cy.visit("http://localhost:3000")
			.root()
			.should("contain", "About the app")
			.contains("About the app")
			.should("be.visible")
			.scrollIntoView()
			.click({ force: true })
			.root()
			.should("contain", "Dominik")
			.get("a")
			.contains("Dominik")
			.invoke("attr", "href")
			.should("equal", "https://dominik-wilkowski.com")
			.root()
			.should("contain", "submit an issue")
			.get("a")
			.contains("submit an issue")
			.invoke("attr", "href")
			.should("equal", "https://github.com/dominikwilkowski/bronzies/issues");
	});
});
