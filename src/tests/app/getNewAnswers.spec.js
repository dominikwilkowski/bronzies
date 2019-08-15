import { getNewAnswers } from '../../game.js';

test('getNewAnswers - Returns the right amount and includes the current answer', () => {
	const current = {
		image: 'key3',
		other: 'stuff',
		foo: 1,
		bar: true,
	};
	const deck = [
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
	const db = [
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
		{
			image: 'key5',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
		{
			image: 'key6',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
	];

	const result = getNewAnswers( current, deck, db );

	expect( result.length ).toBe( 5 );
	expect( result.filter( item => item.image === 'key3' ).length ).toBe( 1 );
});

test('getNewAnswers - Returns the limit even when deck is smaller', () => {
	const current = {
		image: 'key2',
		other: 'stuff',
		foo: 1,
		bar: true,
	};
	const deck = [
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
	];
	const db = [
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
		{
			image: 'key5',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
		{
			image: 'key6',
			other: 'stuff',
			foo: 1,
			bar: true,
		},
	];

	const result = getNewAnswers( current, deck, db );

	expect( result.length ).toBe( 5 );
	expect( result.filter( item => item.image === 'key2' ).length ).toBe( 1 );
});

test('getNewAnswers - Respects the limit', () => {
	const current = {
		image: 'key2',
		other: 'stuff',
		foo: 1,
		bar: true,
	};
	const deck = [
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
	const db = [
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

	const result = getNewAnswers( current, deck, db, 2 );

	expect( result.length ).toBe( 3 );
	expect( result.filter( item => item.image === 'key2' ).length ).toBe( 1 );
});
