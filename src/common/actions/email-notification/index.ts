/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { RegularActionTypeDefinition } from '@nelio/forms/types';

/**
 * Internal dependencies
 */
import defaults from './defaults';
import edit from './edit';
import type { EmailNotification } from './types';

const type: RegularActionTypeDefinition< EmailNotification > = {
	isPremium: false,
	isUnique: false,
	type: 'email-notification' as const,
	label: _x( 'Email notification', 'text', 'nelio-forms' ),
	icon: 'email',
	defaults,
	edit,
};

export default type;
