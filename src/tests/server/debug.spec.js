import { debug } from '../../../server/utils.js';

test('debug - Output nothing when code is wrong', () => {
	console.log = jest.fn();

	debug( 'text', 'wrong', null );

	expect( console.log.mock.calls.length ).toBe( 0 );
});

test('debug - Output something when code is "report"', () => {
	console.log = jest.fn();

	debug( 'text to be displayed', 'report', null );

	expect( console.log.mock.calls.length ).toBe( 1 );
	expect( console.log.mock.calls[ 0 ][ 0 ].includes('text to be displayed') ).toBe( true );
});

test('debug - Output something when code is "error"', () => {
	console.error = jest.fn();

	debug( 'text to be displayed', 'error', null );

	expect( console.error.mock.calls.length ).toBe( 1 );
	expect( console.error.mock.calls[ 0 ][ 0 ].includes('text to be displayed') ).toBe( true );
});

test('debug - Output something when code is "interaction"', () => {
	console.log = jest.fn();

	debug( 'text to be displayed', 'interaction', null );

	expect( console.log.mock.calls.length ).toBe( 1 );
	expect( console.log.mock.calls[ 0 ][ 0 ].includes('text to be displayed') ).toBe( true );
});

test('debug - Output IP address from header', () => {
	console.log = jest.fn();
	console.error = jest.fn();

	const req = {
		headers: {
			'x-forwarded-for': 'ip-address-set'
		}
	};

	debug( 'text to be displayed', 'report', req );
	debug( 'text to be displayed', 'error', req );
	debug( 'text to be displayed', 'interaction', req );

	expect( console.log.mock.calls.length ).toBe( 2 );
	expect( console.log.mock.calls[ 0 ][ 0 ].includes('ip-address-set') ).toBe( true );
	expect( console.error.mock.calls[ 0 ][ 0 ].includes('ip-address-set') ).toBe( true );
	expect( console.log.mock.calls[ 1 ][ 0 ].includes('ip-address-set') ).toBe( true );
});

test('debug - Output IP address from connection', () => {
	console.log = jest.fn();
	console.error = jest.fn();

	const req = {
		headers: {},
		connection: {
			remoteAddress: 'ip-address-set'
		}
	};

	debug( 'text to be displayed', 'report', req );
	debug( 'text to be displayed', 'error', req );
	debug( 'text to be displayed', 'interaction', req );

	expect( console.log.mock.calls.length ).toBe( 2 );
	expect( console.log.mock.calls[ 0 ][ 0 ].includes('ip-address-set') ).toBe( true );
	expect( console.error.mock.calls[ 0 ][ 0 ].includes('ip-address-set') ).toBe( true );
	expect( console.log.mock.calls[ 1 ][ 0 ].includes('ip-address-set') ).toBe( true );
});
