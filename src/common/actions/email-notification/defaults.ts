/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import type { EmailNotification } from './types';

const defaults: EmailNotification = {
	to: '{admin_email}',
	from: '{admin_email}',
	replyTo: '',
	subject: _x( 'New Email Notification', 'text', 'nelio-forms' ),
	message: '{all_fields}',
};

export default defaults;
