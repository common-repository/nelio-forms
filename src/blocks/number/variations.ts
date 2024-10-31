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
		name: 'nelio-forms/number-slider',
		title: _x( 'Number slider field', 'text', 'nelio-forms' ),
		description: _x(
			'An input number field with an slider.',
			'text',
			'nelio-forms'
		),
		icon: 'leftright',
		scope: [ 'inserter', 'block', 'transform' ],
		keywords: [
			_x( 'input', 'text', 'nelio-forms' ),
			_x( 'field', 'text', 'nelio-forms' ),
			_x( 'number', 'text', 'nelio-forms' ),
			_x( 'slider', 'text', 'nelio-forms' ),
		],
		attributes: {
			type: 'number-slider',
			label: _x( 'Number slider', 'text', 'nelio-forms' ),
		},
		isActive: [ 'type' ],
	},
];

export default variations;
