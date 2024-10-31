/**
 * Internal dependencies
 */
import defaults from './defaults';
import type { EmailNotification } from './types';

export default function (
	attrs: Partial< EmailNotification >
): EmailNotification {
	return { ...defaults, ...attrs };
}
