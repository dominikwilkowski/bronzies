/** @jsx jsx */
import ImageView from './imageView';
import { jsx } from '@emotion/core';
import PropTypes from 'prop-types';
import TextView from './textView';

function Choises({ items, questionAsImage, action }) {
	return (
		<ul>
			{
				items.map( ( item, key ) => (
					<li key={ key } css={{
						listStyle: 'none',
						padding: 0,
						margin: 0,
					}}>
						<button css={{
							display: 'block',
							appearance: 'none',
							width: '100%',
							background: item.status
								? item.status=== 'correct'
									? '#325C3B'
									: '#EA1C2E'
								: 'transparent',
							padding: '12px',
							border: 'none',
							transition: 'background 0.3s ease, opcaity 0.3s ease, color 0.3s ease',
							fontSize: '21px',
							lineHeight: 1.2,
							'&:disabled': {
								color: '#fff',
							}
						}} type='submit' onClick={ event => action( item.image ) } disabled={ item.status }>
							{
								questionAsImage
									? <TextView text={ item.text } />
									: <ImageView item={ item.image } />
							}
						</button>
					</li>
				))
			}
		</ul>
	);
};

Choises.propTypes = {
	items: PropTypes.array.isRequired,
	questionAsImage: PropTypes.bool.isRequired,
	action: PropTypes.func.isRequired,
};

export default Choises;
