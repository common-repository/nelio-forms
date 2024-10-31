/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { _x } from '@wordpress/i18n';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

const Inspector = ( props: BlockEditProps< Attributes > ): JSX.Element => {
	const { attributes, setAttributes } = props;
	const { minLength, maxLength, required, isLabelHidden } = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ _x( 'Field settings', 'text', 'nelio-forms' ) }
					className="blocks-font-size"
				>
					<TextControl
						label={ _x( 'Minimum length', 'text', 'nelio-forms' ) }
						help={ _x(
							'Limit the minimum text length by characters',
							'text',
							'nelio-forms'
						) }
						value={ minLength }
						type="number"
						onChange={ ( value ) => {
							setAttributes( {
								minLength: isNaN( parseInt( value ) )
									? undefined
									: parseInt( value ),
							} );
						} }
					/>
					<TextControl
						label={ _x( 'Maximum length', 'text', 'nelio-forms' ) }
						help={ _x(
							'Limit the maximum text length by characters',
							'text',
							'nelio-forms'
						) }
						value={ maxLength }
						type="number"
						min={ minLength }
						onChange={ ( value ) => {
							setAttributes( {
								maxLength: isNaN( parseInt( value ) )
									? undefined
									: Math.max( minLength, parseInt( value ) ),
							} );
						} }
					/>
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
						onChange={ ( isRequired ) => {
							setAttributes( { required: isRequired } );
						} }
					/>
					<ToggleControl
						label={ _x( 'Hide label', 'command', 'nelio-forms' ) }
						checked={ isLabelHidden }
						onChange={ ( value ) => {
							setAttributes( { isLabelHidden: value } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
};

export default Inspector;
