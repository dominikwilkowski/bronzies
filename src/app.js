/** @jsx jsx */
import { Fragment, useState, createContext, useContext } from 'react';
import Game, { shuffle, getNewAnswers } from './game';
import { jsx, Global } from '@emotion/core';
import { Router } from '@reach/router';
import Highscore from './highscore';
import { colors } from './theme';
import Header from './header';
import Footer from './footer';
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
	const localQuestions = JSON.parse( localStorage.getItem('questions') );
	let initialQuestionsDB = [];
	if( localQuestions ) {
		initialQuestionsDB = localQuestions;
	}

	const localSvg = localStorage.getItem('svg');
	let initialSvg = [];
	if( localSvg ) {
		initialSvg = localSvg;
		document
			.getElementById('svgSprite')
			.innerHTML = localSvg;
	}

	const wasNoLocalStorage = localQuestions && localSvg ? false : true;

	// state for question database and loading state
	const [ signals, setSignals ] = useState( initialQuestionsDB );
	const [ questionsDB, setQuestionsDB ] = useState( initialQuestionsDB );
	const [ svg, setSvg ] = useState( initialSvg );

	// state for image-to-text mode
	const [ questionsImage, setQuestionsImage ] = useState( shuffle( questionsDB ) );
	const [ indexImage, setIndexImage ] = useState( 0 );
	const newChoicesImage = getNewAnswers( questionsImage[ indexImage ], questionsImage );
	const [ choicesImage, setChoicesImage ] = useState( newChoicesImage );
	const [ correctImage, setCorrectImage ] = useState( false );
	const [ userAnswerImage, setUserAnswerImage ] = useState('');

	// state for text-to-image mode
	const [ questionsText, setQuestionsText ] = useState( shuffle( questionsDB ) );
	const [ indexText, setIndexText ] = useState( 0 );
	const newChoicesText = getNewAnswers( questionsText[ indexText ], questionsText );
	const [ choicesText, setChoicesText ] = useState( newChoicesText );
	const [ correctText, setCorrectText ] = useState( false );
	const [ userAnswerText, setUserAnswerText ] = useState('');

	// state for both modes
	const [ questionAsImage, setQuestionAsImage ] = useState( true );
	const [ wrongAnswers, setWrongAnswers ] = useState([]);
	const [ history, setHistory ] = useState([]);
	const [ rounds, setRounds ] = useState( 1 );
	const [ score, setScore ] = useState( 0 );

	return (
		<GameContext.Provider value={{
			questionsDB, setQuestionsDB,
			svg, setSvg,
			signals, setSignals,
			questionsImage, setQuestionsImage,
			indexImage, setIndexImage,
			choicesImage, setChoicesImage,
			correctImage, setCorrectImage,
			userAnswerImage, setUserAnswerImage,
			questionsText, setQuestionsText,
			indexText, setIndexText,
			choicesText, setChoicesText,
			correctText, setCorrectText,
			userAnswerText, setUserAnswerText,
			questionAsImage, setQuestionAsImage,
			history, setHistory,
			wrongAnswers, setWrongAnswers,
			score, setScore,
			rounds, setRounds,
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
				'*': {
					boxSizing: 'border-box',
				},
				'body, html': {
					fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", ' +
						'"Segoe UI Symbol"',
					padding: 0,
					margin: 0,
					height: '100%',
				},
				'body': {
					background: 'url("background.png")',
					backgroundAttachment: 'fixed',
					display: 'grid',
				},
				'#root': {
					minHeight: '100%',
					display: 'grid',
					gridTemplateRows: '0fr 1fr auto',
				},
				'a': {
					color: colors[ 0 ],
				},
			}} />
			<QuestionProvider>
				<Header />
				<div css={{
					position: 'relative',
				}}>
					<Router>
						<Game default />
						<Highscore path='/highscore' />
						<About path='/about' />
					</Router>
				</div>
				<Footer />
			</QuestionProvider>
		</Fragment>
	);
};

App.propTypes = {}

export default App;
