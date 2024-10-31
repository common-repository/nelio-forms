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
	const {
		isLabelHidden,
		min = '',
		max = '',
		required,
		step,
		type,
	} = attributes;

	const controlType = type === 'datetime' ? 'datetime-local' : type;
	const stepLabel =
		type === 'date'
			? _x( 'Step (in days)', 'text', 'nelio-forms' )
			: _x( 'Step (in seconds)', 'text', 'nelio-forms' );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ _x( 'Field settings', 'text', 'nelio-forms' ) }
				>
					<TextControl
						label={ _x( 'Min', 'text', 'nelio-forms' ) }
						type={ controlType }
						value={ min }
						max={ max }
						step={ step }
						onChange={ ( value ) => {
							setAttributes( { min: value } );
						} }
					/>
					<TextControl
						label={ _x( 'Max', 'text', 'nelio-forms' ) }
						type={ controlType }
						value={ max }
						min={ min }
						step={ step }
						onChange={ ( value ) => {
							setAttributes( { max: value } );
						} }
					/>
					<TextControl
						label={ stepLabel }
						type="number"
						value={ step }
						onChange={ ( value ) => {
							setAttributes( { step: Number( value ) } );
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
						onChange={ ( value ) => {
							setAttributes( { required: value } );
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
