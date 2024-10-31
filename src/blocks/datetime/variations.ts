/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { WPBlockVariation } from '@nelio/forms/types';

/**
 * Internal dependencies
 */
import { Attributes } from './types';

const variations: ReadonlyArray< WPBlockVariation< Attributes > > = [
	{
		name: 'nelio-forms/date',
		title: _x( 'Date field', 'text', 'nelio-forms' ),
		description: _x( 'An input date field.', 'text', 'nelio-forms' ),
		icon: 'calendar-alt',
		scope: [ 'inserter', 'block', 'transform' ],
		keywords: [
			_x( 'input', 'text', 'nelio-forms' ),
			_x( 'field', 'text', 'nelio-forms' ),
			_x( 'date', 'text', 'nelio-forms' ),
		],
		attributes: {
			type: 'date',
			label: _x( 'Date', 'text', 'nelio-forms' ),
			step: 1,
		},
		isActive: [ 'type' ],
	},
	{
		name: 'nelio-forms/time',
		title: _x( 'Time field', 'text', 'nelio-forms' ),
		description: _x( 'An input time field.', 'text', 'nelio-forms' ),
		icon: 'clock',
		scope: [ 'inserter', 'block', 'transform' ],
		keywords: [
			_x( 'input', 'text', 'nelio-forms' ),
			_x( 'field', 'text', 'nelio-forms' ),
			_x( 'time', 'text', 'nelio-forms' ),
		],
		attributes: {
			type: 'time',
			label: _x( 'Time', 'text', 'nelio-forms' ),
		},
		isActive: [ 'type' ],
	},
];

export default variations;
