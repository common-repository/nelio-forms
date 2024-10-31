/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { _x } from '@wordpress/i18n';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * External dependencies
 */
import { RequiredIcon } from '@nelio/forms/components';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

const BlockToolbar = ( props: BlockEditProps< Attributes > ): JSX.Element => {
	const { attributes, setAttributes } = props;
	const { required } = attributes;

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={ RequiredIcon }
						isPressed={ required }
						label={ _x( 'Required', 'text', 'nelio-forms' ) }
						onClick={ () =>
							setAttributes( { required: ! required } )
						}
					/>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
};

export default BlockToolbar;
