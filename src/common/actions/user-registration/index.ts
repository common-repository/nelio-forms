/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import type { PremiumActionTypeDefinition } from '@nelio/forms/types';

const action: PremiumActionTypeDefinition = {
	isPremium: true as const,
	isUnique: false,
	type: 'user-registration',
	label: _x( 'User registration', 'text', 'nelio-forms' ),
	icon: 'admin-users',
	canCurrentUserUse: ( select ) =>
		!! select( 'core' ).canUser( 'create', 'users', '' ),
};

export default action;
