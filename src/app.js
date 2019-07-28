/** @jsx jsx */
import { Fragment, useState, useEffect, createContext, useContext } from 'react';
import { jsx, Global } from '@emotion/core';
import Loading from './loading';
import Main from './main';

// Simple Fisher–Yates shuffle function https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
export function shuffle( array ) {
	const newArray = [ ...array ]; // cloning so we don't manipulate the input data
	let index = newArray.length;

	while( index ) {
		const randIndex = Math.floor( Math.random() * index-- );
		const value = newArray[ index ];

		newArray[ index ] = newArray[ randIndex ];
		newArray[ randIndex ] = value;
	}

	return newArray;
}

// Context for questions from REST API
const QuestionContext = createContext();
export function useQuestions() {
	return useContext( QuestionContext );
};

// Where we get the data from the server
const QuestionProvider = ({ children }) => {
	const [ image2text, setImage2text ] = useState([]);
	const [ text2image, setText2image ] = useState([]);

	useEffect( () => {
		const getData = async () => {
			try {
				const data = await fetch('http://localhost:5555/api/questions');
				// const Sleep = wait => new Promise( resolve => setTimeout( resolve, wait ) );
				// await Sleep(5000)
				const json = await data.json();
				setImage2text( shuffle( json ) );
				setText2image( shuffle( json ) );
			}
			catch( error ) {
				console.error( error );
			}
		}

		getData();
	}, []);


	return (
		<QuestionContext.Provider value={{ image2text, text2image, setImage2text, setText2image }}>
			{ children }
		</QuestionContext.Provider>
	);
};

// The main App that loads data first then switches to main app
function App() {
	return (
		<Fragment>
			<Global styles={{
				'body, html': {
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", ' +
						'"Segoe UI Symbol"',
				}
			}} />
			<QuestionProvider>
				<Loading Component={ () => <Main /> } />
			</QuestionProvider>
		</Fragment>
	);
};

App.propTypes = {}

export default App;
