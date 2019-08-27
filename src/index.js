import * as serviceWorker from './serviceWorker';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './app';

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.register();
