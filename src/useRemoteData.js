import { useState, useRef, useEffect } from 'react';

/**
 * A hook to load data from remote and keep track of the loading state
 */
function useRemoteData( url, timeout = 3000 ) {
	const [ loadingState, setLoadingState ] = useState('loading');
	const loadingStateRef = useRef( loadingState );
	const [ data, setData ] = useState([]);

	useEffect(() => {
		setTimeout( () => {
			if( loadingStateRef.current === 'loading' ) {
				loadingStateRef.current = 'stale';
				setLoadingState( loadingStateRef.current );
			}
		}, timeout );

		( async () => {
			loadingStateRef.current = 'loading';
			setLoadingState( loadingStateRef.current );
			try {
				const response = await fetch( url );
				// const Sleep = wait => new Promise( resolve => setTimeout( resolve, wait ) );
				// await Sleep( 4000 );

				if( response.ok ) {
					const data = await response.json();
					setData( data );
					loadingStateRef.current = 'loaded';
					setLoadingState( loadingStateRef.current );
				}
				else {
					console.error( response.statusText );
					loadingStateRef.current = 'failed';
					setLoadingState( loadingStateRef.current );
				}
			}
			catch( error ) {
				loadingStateRef.current = 'failed';
				setLoadingState( loadingStateRef.current );
			}
		})();
	}, [ url, timeout ] );

	return { data, loadingState: loadingStateRef.current };
};

useRemoteData.propTypes = {};

export default useRemoteData;
