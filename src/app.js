/** @jsxImportSource @emotion/react */

import { Fragment, useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game, { shuffle, getNewAnswers } from './game';
import { jsx, Global } from '@emotion/react';
import Highscore from './highscore';
import { colors } from './theme';
import Header from './header';
import Footer from './footer';
import About from './about';
import CPR from './cpr';

/**
 * Context for all game data
 */
const DBContext = createContext();
const GameContext = createContext();
export function useGameData() {
	const db = useContext( DBContext );
	const game = useContext( GameContext );

	return { ...db, ...game };
};

const GameStateProvider = ({ children }) => {
	const localQuestions = JSON.parse( localStorage.getItem('questions') );
	const initialQuestionsDB = localQuestions ? localQuestions : [];

	// state for image-to-text mode
	const [ questionsImage, setQuestionsImage ] = useState( shuffle( initialQuestionsDB ) );
	const [ indexImage, setIndexImage ] = useState( 0 );
	const newChoicesImage = getNewAnswers( questionsImage[ indexImage ], questionsImage );
	const [ choicesImage, setChoicesImage ] = useState( newChoicesImage );
	const [ correctImage, setCorrectImage ] = useState( false );
	const [ userAnswerImage, setUserAnswerImage ] = useState('');

	// state for text-to-image mode
	const [ questionsText, setQuestionsText ] = useState( shuffle( initialQuestionsDB ) );
	const [ indexText, setIndexText ] = useState( 0 );
	const newChoicesText = getNewAnswers( questionsText[ indexText ], questionsText );
	const [ choicesText, setChoicesText ] = useState( newChoicesText );
	const [ correctText, setCorrectText ] = useState( false );
	const [ userAnswerText, setUserAnswerText ] = useState('');

	// state for both modes
	const [ questionAsImage, setQuestionAsImage ] = useState( true );
	const [ questionType, setQuestionType ] = useState('Signals');
	const [ wrongAnswers, setWrongAnswers ] = useState([]);
	const [ history, setHistory ] = useState([]);
	const [ rounds, setRounds ] = useState( 1 );
	const [ score, setScore ] = useState( 0 );
	const [ nays, setNays ] = useState( 0 );

	// reset states to start (for highscore entry)
	const resetScore = () => {
		const questionsImage = shuffle( initialQuestionsDB );
		setQuestionsImage( questionsImage );
		setIndexImage( 0 );
		setChoicesImage( getNewAnswers( questionsImage[ 0 ], questionsImage ) );
		setCorrectImage( false );
		setUserAnswerImage('');

		const questionsText = shuffle( initialQuestionsDB )
		setQuestionsText( questionsText );
		setIndexText( 0 );
		setChoicesText( getNewAnswers( questionsText[ 0 ], questionsText ) );
		setCorrectText( false );
		setUserAnswerText('');

		setQuestionAsImage( true );
		setWrongAnswers([]);
		setHistory([]);
		setRounds( 1 );
		setScore( 0 );
		setNays( 0 );
	}

	const localSvg = localStorage.getItem('svg');
	const svgSprite = document.getElementById('svgSprite').innerHTML;
	if( !svgSprite ) {
		document
			.getElementById('svgSprite')
			.innerHTML = localSvg;
	}

	const wasNoLocalStorage = localQuestions && localSvg ? false : true;

	return (
		<GameContext.Provider value={{
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
			questionType, setQuestionType,
			wrongAnswers, setWrongAnswers,
			history, setHistory,
			rounds, setRounds,
			score, setScore,
			nays, setNays,
			wasNoLocalStorage,
			resetScore,
		}}>
			{ children }
		</GameContext.Provider>
	);
};

/**
 * Where we get the data from the server
 */
const DBProvider = ({ children }) => {
	const localQuestions = JSON.parse( localStorage.getItem('questions') );
	const initialQuestionsDB = localQuestions ? localQuestions : [];
	const localSvg = localStorage.getItem('svg');

	const [ signals, setSignals ] = useState( initialQuestionsDB );
	const [ questionsDB, setQuestionsDB ] = useState( initialQuestionsDB );
	const [ svg, setSvg ] = useState( localSvg );

	return (
		<DBContext.Provider value={{
			signals, setSignals,
			questionsDB, setQuestionsDB,
			svg, setSvg,
		}}>
			{ children }
		</DBContext.Provider>
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
					'@media(min-width: 550px)': {
						padding: '0.5rem 1rem',
					},
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
					color: colors.action,
				},
			}} />
			<GameStateProvider>
				<DBProvider>
					<BrowserRouter>
						<Header />
						<div css={{
							position: 'relative',
						}}>
							<Routes>
								<Route path="/" element={<Game />} />
								<Route path="/highscore" element={<Highscore />} />
								<Route path="/about" element={<About />} />
								<Route path="/cpr" element={<CPR />} />
								<Route path="*" element={<Game />} />
							</Routes>
						</div>
						<Footer />
					</BrowserRouter>
				</DBProvider>
			</GameStateProvider>
		</Fragment>
	);
};

App.propTypes = {}

export default App;
