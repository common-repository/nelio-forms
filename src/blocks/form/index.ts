/**
 * WordPress dependencies
 */
import { registerBlockType, BlockConfiguration } from '@wordpress/blocks';

/**
 * External dependencies
 */
import { PluginIcon as icon } from '@nelio/forms/components';
import { getFormEditorSettings } from '@nelio/forms/utils';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import './style.scss';

const allowedBlocks = getFormEditorSettings().allowedBlocks;

type BlockConfigFix = Omit< BlockConfiguration, 'providesContext' >;
registerBlockType( metadata as BlockConfigFix, {
	icon,
	edit: edit( allowedBlocks ),
} );
