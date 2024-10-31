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
	type: 'mailchimp-integration',
	label: _x( 'Mailchimp integration', 'text', 'nelio-forms' ),
	icon,
	canCurrentUserUse: ( select ) =>
		!! select( 'core' ).canUser( 'create', 'users', '' ),
};

export default action;
