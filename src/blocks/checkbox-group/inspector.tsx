/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { _x } from '@wordpress/i18n';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

const Inspector = ( props: BlockEditProps< Attributes > ): JSX.Element => {
	const { attributes, setAttributes } = props;
	const { required } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ _x( 'Field settings', 'text', 'nelio-forms' ) }
				>
					<ToggleControl
						label={ _x(
							'Field is required',
							'text',
							'nelio-forms'
						) }
						help={ _x(
							'Does this field have to be completed for the form to be submitted?',
							'text',
							'nelio-forms'
						) }
						checked={ required }
						onChange={ ( value ) => {
							setAttributes( { required: value } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Inspector;
