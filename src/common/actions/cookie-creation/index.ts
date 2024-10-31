/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { PremiumActionTypeDefinition } from '@nelio/forms/types';

/**
 * Internal dependencies
 */
import icon from './icon';

const action: PremiumActionTypeDefinition = {
	isPremium: true as const,
	isUnique: false,
	type: 'cookie-creation',
	label: _x( 'Cookie creation', 'text', 'nelio-forms' ),
	icon,
};

export default action;
