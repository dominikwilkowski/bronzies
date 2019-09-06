// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
import { useState, useEffect, useRef } from 'react';

function useInterval( callback, delay ) {
	const savedCallback = useRef();

	useEffect( () => {
		savedCallback.current = callback;
	}, [ callback ] );

	useEffect( () => {
		function tick() {
			savedCallback.current();
		}

		if( delay !== null ) {
			const id = setInterval( tick, delay );
			return () => clearInterval( id );
		}
	}, [ delay ] );
}

useInterval.propTypes = {};

export default useInterval;
