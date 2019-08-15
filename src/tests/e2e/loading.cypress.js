describe('The main app', () => {
	it('Loads data into localStorage and retains is over refresh', () => {
		cy.visit('http://localhost:3000');
		expect( localStorage.getItem('questions') ).to.eq( null );
		expect( localStorage.getItem('svg') ).to.eq( null );

		setTimeout( async () => {
			expect( localStorage.getItem('questions') ).to.not.eq( null );
			expect( localStorage.getItem('svg') ).to.not.eq( null );

			await cy.reload();

			expect( localStorage.getItem('questions') ).to.not.eq( null );
			expect( localStorage.getItem('svg') ).to.not.eq( null );
		}, 500); // TODO this should not be hardcoded
	});
});
