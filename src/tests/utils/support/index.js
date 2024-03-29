import '@testing-library/cypress/add-commands';

// fixing beforeunload bug in cypress https://github.com/cypress-io/cypress/issues/2118
Cypress.on('window:load', window => {
	const original = window.addEventListener;
	window.addEventListener = () => {
		if( arguments && arguments[ 0 ] === 'beforeunload' ) {
			return;
		}
		return original.apply( this, arguments );
	};
});
