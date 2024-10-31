/**
 * WordPress dependencies
 */
import { registerPlugin } from '@wordpress/plugins';

/**
 * Internal dependencies
 */
import { FormEditorExtensions } from './components';
import './style.scss';

registerPlugin( 'nelio-forms-extensions', {
	icon: () => null,
	render: FormEditorExtensions,
} );
