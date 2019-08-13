import { tagAnswer } from '../../game.js';

test('tagAnswer - Adds a key to an array of objects', () => {
	const answers = [
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
	const image = 'key3';
	const tagName = 'key-name';
	const tag = 'value of tag';

	const expected = [
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
			'key-name': 'value of tag',
		},
		{
			image: 'key4',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
	];

	const result = tagAnswer( answers, image, tagName, tag );

	expect( result ).toEqual( expected );
});

test('tagAnswer - Adds nothing if there are no matches', () => {
	const answers = [
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
	const image = 'key3invalid';
	const tagName = 'key-name';
	const tag = 'value of tag';

	const expected = [
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

	const result = tagAnswer( answers, image, tagName, tag );

	expect( result ).toEqual( expected );
});
