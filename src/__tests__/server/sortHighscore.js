import { sortHighscore } from '../../../server/server.js';

test('sortHighscore - Sorts data', () => {
	const input = [
		{
			"score": 3,
			"date": "2015-09-29T02:28:03.104Z",
		},
		{
			"score": 4,
			"date": "2014-07-25T04:52:40.524Z",
		},
		{
			"score": 1,
			"date": "2017-10-23T03:17:39.455Z",
		},
		{
			"score": 0,
			"date": "2019-08-07T11:02:59.721Z",
		},
		{
			"score": 2,
			"date": "2016-10-12T21:34:14.808Z",
		},
	];

	const top50Result = [
		{
			"score": 4,
			"date": "2014-07-25T04:52:40.524Z",
		},
		{
			"score": 3,
			"date": "2015-09-29T02:28:03.104Z",
		},
		{
			"score": 2,
			"date": "2016-10-12T21:34:14.808Z",
		},
		{
			"score": 1,
			"date": "2017-10-23T03:17:39.455Z",
		},
		{
			"score": 0,
			"date": "2019-08-07T11:02:59.721Z",
		},
	];

	const latestResult = [
		{
			"score": 0,
			"date": "2019-08-07T11:02:59.721Z",
		},
		{
			"score": 1,
			"date": "2017-10-23T03:17:39.455Z",
		},
		{
			"score": 2,
			"date": "2016-10-12T21:34:14.808Z",
		},
		{
			"score": 3,
			"date": "2015-09-29T02:28:03.104Z",
		},
		{
			"score": 4,
			"date": "2014-07-25T04:52:40.524Z",
		},
	];

	const { top50, latest, length } = sortHighscore( input );

	expect( top50 ).toEqual( top50Result );
	expect( latest ).toEqual( latestResult );
	expect( length ).toBe( 5 );
});
