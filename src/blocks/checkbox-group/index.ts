/**
 * WordPress dependencies
 */
import {
	registerBlockType,
	registerBlockStyle,
	BlockConfiguration,
} from '@wordpress/blocks';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { fixBlockSettings } from '@nelio/forms/utils';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';
import transforms from './transforms';
import './style.scss';

registerBlockType(
	metadata as BlockConfiguration,
	fixBlockSettings( {
		transforms,
		edit,
		save,
	} )
);

registerBlockStyle( metadata.name, {
	name: 'horizontal-layout',
	label: _x( 'Horizontal layout', 'text', 'nelio-forms' ),
} );
