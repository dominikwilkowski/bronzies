/** @jsx jsx */
import { Fragment, useState, useEffect, createContext, useContext, useRef } from 'react';
import { jsx, Global } from '@emotion/core';
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
	const [ questionsDB, setQuestionsDB ] = useState([]);
	const [ loadingState, setLoadingState ] = useState('loading');
	const loadingStateRef = useRef( loadingState );

	useEffect( () => {
		setTimeout( () => {
			if( loadingStateRef.current === 'loading' ) setLoadingState('stale');
		}, 3000);

		const getData = async () => {
			try {
				const data = await fetch('http://localhost:5555/api/questions');
				const Sleep = wait => new Promise( resolve => setTimeout( resolve, wait ) );
				await Sleep( 5000 );
				loadingStateRef.current = 'loaded';
				setQuestionsDB( await data.json() );
				setLoadingState( loadingStateRef.current );
			}
			catch( error ) {
				console.error( error );
				loadingStateRef.current = 'failed';
				setLoadingState( loadingStateRef.current );
			}
		}

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
