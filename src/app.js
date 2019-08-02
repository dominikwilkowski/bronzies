/** @jsx jsx */
import { Fragment, useState, createContext, useContext } from 'react';
import Game, { shuffle, getNewAnswers } from './game';
import { jsx, Global } from '@emotion/core';
import { Router } from '@reach/router';
import Highscore from './highscore';
import { colors } from './theme';
import About from './about';

/**
 * Context for all game data
 */
const GameContext = createContext();
export function useGameData() {
	return useContext( GameContext );
};

/**
 * Where we get the data from the server
 */
const QuestionProvider = ({ children }) => {
	// first we check local storage for questions
	const local = JSON.parse( localStorage.getItem('questions') );
	let initialQuestionsDB = [];
	let wasNoLocalStorage = true;
	if( local ) {
		initialQuestionsDB = local;
		wasNoLocalStorage = false;
	}

	// state for question database and loading state
	const [ questionsDB, setQuestionsDB ] = useState( initialQuestionsDB );

	// state for image-to-text mode
	const [ questionsImage, setQuestionsImage ] = useState( shuffle( questionsDB ) );
	const [ indexImage, setIndexImage ] = useState( 0 );
	const newChoicesImage = getNewAnswers( questionsImage[ indexImage ], questionsImage );
	const [ choicesImage, setChoicesImage ] = useState( newChoicesImage );
	const [ correctImage, setCorrectImage ] = useState( false );
	const [ userAnswerImage, setUserAnswerImage ] = useState('');
	const [ roundsImage, setRoundsImage ] = useState( 1 );

	// state for text-to-image mode
	const [ questionsText, setQuestionsText ] = useState( shuffle( questionsDB ) );
	const [ indexText, setIndexText ] = useState( 0 );
	const newChoicesText = getNewAnswers( questionsText[ indexText ], questionsText );
	const [ choicesText, setChoicesText ] = useState( newChoicesText );
	const [ correctText, setCorrectText ] = useState( false );
	const [ userAnswerText, setUserAnswerText ] = useState('');
	const [ roundsText, setRoundsText ] = useState( 1 );

	// state for both modes
	const [ questionAsImage, setQuestionAsImage ] = useState( true );
	const [ history, setHistory ] = useState({});
	const [ score, setScore ] = useState( 0 );

	return (
		<GameContext.Provider value={{
			questionsDB, setQuestionsDB,
			questionsImage, setQuestionsImage,
			indexImage, setIndexImage,
			choicesImage, setChoicesImage,
			correctImage, setCorrectImage,
			userAnswerImage, setUserAnswerImage,
			roundsImage, setRoundsImage,
			questionsText, setQuestionsText,
			indexText, setIndexText,
			choicesText, setChoicesText,
			correctText, setCorrectText,
			userAnswerText, setUserAnswerText,
			roundsText, setRoundsText,
			questionAsImage, setQuestionAsImage,
			history, setHistory,
			score, setScore,
			wasNoLocalStorage,
		}}>
			{ children }
		</GameContext.Provider>
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
					padding: 0,
					margin: 0,
					'a': {
						color: colors[ 0 ],
					}
				}
			}} />
			<QuestionProvider>
				<Router>
					<Game path='/' />
					<Highscore path='/highscore' />
					<About path='/about' />
				</Router>
			</QuestionProvider>
		</Fragment>
	);
};

App.propTypes = {}

export default App;
