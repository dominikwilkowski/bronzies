/** @jsx jsx */
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import { useEffect } from 'react';

/**
 * Slugify a string
 *
 * @author Matthias Hagemann @mhagemann
 * @url    https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
 *
 * @param  {string} string - A string to be cleaned
 *
 * @return {string}        - A cleaned and slugified string
 */
function slugify( string ) {
	return string
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-')     // Replace spaces with -
		.replace(/&/g, '-and-')   // Replace & with 'and'
		.replace(/[^\w\-]+/g, '') // Remove all non-word characters
		.replace(/\-\-+/g, '-')   // Replace multiple - with single -
		.replace(/^-+/, '')       // Trim - from start of text
		.replace(/-+$/, '')       // Trim - from end of text
}

function SVG({ src, title, description, role = 'img' }) {
	const attr = {};
	if( title || description ) {
		const ids = [];
		if( title ) ids.push( slugify(`${ src }-title`) );
		if( description ) ids.push( slugify(`${ src }-desc`) );
		attr['aria-labelledby'] = `${ ids.join(' ') }`;
	}

	useEffect( () => {
		window.svg4everybody();
	});

	return (
		<svg role={ role } { ...attr }>
			{
				title && <title id={ slugify(`${ src }-title`) }>{ title }</title>
			}
			<use xlinkHref={ src } />
			{
				description && <desc id={ slugify(`${ src }-desc`) }>{ description }</desc>
			}
		</svg>
	);
};

SVG.propTypes = {
	src: PropTypes.string.isRequired,
	title: PropTypes.string,
	description: PropTypes.string,
	role: PropTypes.string,
};

export default SVG;
