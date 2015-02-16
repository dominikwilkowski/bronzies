'use strict';

var CONFIG = (function() {

	return {
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// settings
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		debug: true, //debugging infos
		dbconnection: 'mongodb://localhost:27017/bronzies', //mongo DB connection string


		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		// debugging prettiness
		//----------------------------------------------------------------------------------------------------------------------------------------------------------
		debugging: function( text, code ) {

			if( code === 'report' ) {
				if(CONFIG.debug) console.log( chalk.green('\u2713 ') + text );
			}

			else if( code === 'error' ) {
				if(CONFIG.debug) console.log( chalk.red('\u2717 ') + text );
			}

			else if( code === 'interaction' ) {
				if(CONFIG.debug) console.log( chalk.blue('\u261C ') + text );
			}

		}

	};

})();