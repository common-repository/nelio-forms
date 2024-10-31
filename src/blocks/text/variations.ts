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
		name: 'nelio-forms/email',
		title: _x( 'Email field', 'text', 'nelio-forms' ),
		description: _x(
			'An input field that should contain an e-mail address.',
			'text',
			'nelio-forms'
		),
		icon: 'email-alt',
		scope: [ 'inserter', 'block', 'transform' ],
		keywords: [
			_x( 'input', 'text', 'nelio-forms' ),
			_x( 'field', 'text', 'nelio-forms' ),
			_x( 'email', 'text', 'nelio-forms' ),
		],
		attributes: {
			type: 'email',
			label: _x( 'Email', 'text', 'nelio-forms' ),
		},
		isActive: [ 'type' ],
	},
	{
		name: 'nelio-forms/password',
		title: _x( 'Password field', 'text', 'nelio-forms' ),
		description: _x(
			'An input field for a password.',
			'text',
			'nelio-forms'
		),
		icon: 'privacy',
		scope: [ 'inserter', 'block', 'transform' ],
		keywords: [
			_x( 'input', 'text', 'nelio-forms' ),
			_x( 'field', 'text', 'nelio-forms' ),
			_x( 'password', 'text', 'nelio-forms' ),
		],
		attributes: {
			type: 'password',
			label: _x( 'Password', 'text', 'nelio-forms' ),
			requiresConfirmation: false,
		},
		isActive: [ 'type' ],
	},
	{
		name: 'nelio-forms/telephone',
		title: _x( 'Phone field', 'text', 'nelio-forms' ),
		description: _x(
			'An input field that should contain a telephone number.',
			'text',
			'nelio-forms'
		),
		icon: 'phone',
		scope: [ 'inserter', 'block', 'transform' ],
		keywords: [
			_x( 'input', 'text', 'nelio-forms' ),
			_x( 'field', 'text', 'nelio-forms' ),
			_x( 'phone', 'text', 'nelio-forms' ),
		],
		attributes: {
			type: 'tel',
			label: _x( 'Phone', 'text', 'nelio-forms' ),
		},
		isActive: [ 'type' ],
	},
	{
		name: 'nelio-forms/url',
		title: _x( 'URL field', 'text', 'nelio-forms' ),
		description: _x(
			'An input field that should contain a URL address.',
			'text',
			'nelio-forms'
		),
		icon: 'admin-site-alt3',
		scope: [ 'inserter', 'block', 'transform' ],
		keywords: [
			_x( 'input', 'text', 'nelio-forms' ),
			_x( 'field', 'text', 'nelio-forms' ),
			_x( 'phone', 'text', 'nelio-forms' ),
		],
		attributes: {
			type: 'url',
			label: _x( 'Website URL', 'text', 'nelio-forms' ),
		},
		isActive: [ 'type' ],
	},
];

export default variations;
