/** @jsx jsx */
import { Fragment, useState, useEffect, createContext, useContext, useRef } from 'react';
import { jsx, Global } from '@emotion/core';
import { colors } from './theme';
import Loading from './loading';
import Main from './main';

/**
 * Context for questions from REST API
 */
const QuestionContext = createContext();
export function useQuestions() {
	return useContext( QuestionContext );
};

/**
 * Where we get the data from the server
 */
const QuestionProvider = ({ children }) => {
	// first we check local storage for questions
	const local = JSON.parse( localStorage.getItem('questions') );
	let initialQuestionsDB = [];
	let initialLoadingState = 'loading';
	if( local ) {
		initialQuestionsDB = local;
		initialLoadingState = 'loaded';
	}

	const [ questionsDB, setQuestionsDB ] = useState( initialQuestionsDB );
	const [ loadingState, setLoadingState ] = useState( initialLoadingState );
	const loadingStateRef = useRef( loadingState );

	/**
	 * Let's load load data and keep track of the loading state
	 */
	useEffect( () => {
		// we'll mark the fetch stale after a little while to give users feedback
		setTimeout( () => {
			if( loadingStateRef.current === 'loading' ) setLoadingState('stale');
		}, 3000);

		// then we check the server and add the fresh questions to our state for the next round
		const getData = async () => {
			try {
				const data = await fetch('http://localhost:5555/api/questions');
				// const Sleep = wait => new Promise( resolve => setTimeout( resolve, wait ) );
				// await Sleep( 3500 );
				localStorage.setItem( 'questions', JSON.stringify( await data.json() ) );
				setQuestionsDB( JSON.parse( localStorage.getItem('questions') ) );
				loadingStateRef.current = 'loaded';
				setLoadingState( loadingStateRef.current );
			}
			catch( error ) {
				console.error( error );
				loadingStateRef.current = 'failed';
				setLoadingState( loadingStateRef.current );
			}
		};

		getData();
	}, []);

	return (
		<QuestionContext.Provider value={{ questionsDB, loadingState }}>
			{ children }
		</QuestionContext.Provider>
	);
};

/**
 * The main App that loads data first then switches to main app
 */
function App() {
	return (
		<Fragment>
			<Global styles={{
				'body, html': {
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", ' +
						'"Segoe UI Symbol"',
					'a': {
						color: colors[ 0 ],
					}
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
