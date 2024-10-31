/**
 * WordPress dependencies
 */
import { registerBlockType, BlockConfiguration } from '@wordpress/blocks';

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
import variations from './variations';
import transforms from './transforms';
import './style.scss';

registerBlockType(
	metadata as BlockConfiguration,
	fixBlockSettings( {
		transforms,
		edit,
		save,
		variations,
	} )
);
