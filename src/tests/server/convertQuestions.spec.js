import { convertQuestions } from '../../../server/server.js';

test('convertQuestions - Convert array into object', () => {
	const input = [
		{
			image: 'key1',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
		{
			image: 'key2',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
		{
			image: 'key3',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
		{
			image: 'key4',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
	];

	const output = {
		key1: {
			image: 'key1',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
		key2: {
			image: 'key2',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
		key3: {
			image: 'key3',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
		key4: {
			image: 'key4',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
	};

	expect( convertQuestions( input ) ).toStrictEqual( output );
});
