import { shuffle } from '../../game.js';

test('shuffle - Shuffles data', () => {
	const input = [ 1, 2, 3, 4, 5, 6 ];

	const result = shuffle( input );

	expect( input ).not.toEqual( result );
});
