describe('The main app', () => {
	it('should load data into localStorage and retains it over browser refreshs', () => {
		cy.visit('http://localhost:3000');
		expect( localStorage.getItem('questions') ).to.eq( null );
		expect( localStorage.getItem('svg') ).to.eq( null );

		cy.wait( 1000 ).then( () => {
			expect( localStorage.getItem('questions') ).to.not.eq( null );
			expect( localStorage.getItem('svg') ).to.not.eq( null );

			cy.reload();

			expect( localStorage.getItem('questions') ).to.not.eq( null );
			expect( localStorage.getItem('svg') ).to.not.eq( null );
		});
	});
});
