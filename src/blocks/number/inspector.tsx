/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { _x } from '@wordpress/i18n';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

const Inspector = ( props: BlockEditProps< Attributes > ): JSX.Element => {
	const { attributes, setAttributes } = props;
	const {
		customUnit = '',
		customUnitPosition,
		isLabelHidden,
		min = 0,
		max = 100,
		required,
		showCustomUnit,
		step,
		type,
	} = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ _x( 'Field settings', 'text', 'nelio-forms' ) }
				>
					<TextControl
						label={ _x( 'Min', 'text', 'nelio-forms' ) }
						type="number"
						value={ min }
						max={ max }
						step={ step }
						onChange={ ( value ) => {
							setAttributes( { min: Number( value ) } );
						} }
					/>
					<TextControl
						label={ _x( 'Max', 'text', 'nelio-forms' ) }
						type="number"
						value={ max }
						min={ min }
						step={ step }
						onChange={ ( value ) => {
							setAttributes( { max: Number( value ) } );
						} }
					/>
					<TextControl
						label={ _x( 'Step', 'text', 'nelio-forms' ) }
						type="number"
						value={ step }
						onChange={ ( value ) => {
							setAttributes( { step: Number( value ) } );
						} }
					/>
					{ type === 'number-slider' && (
						<ToggleControl
							label={ _x(
								'Show Custom Unit',
								'text',
								'nelio-forms'
							) }
							checked={ showCustomUnit }
							onChange={ ( value ) => {
								setAttributes( { showCustomUnit: value } );
							} }
						/>
					) }
					{ type === 'number-slider' && showCustomUnit && (
						<>
							<TextControl
								label={ _x(
									'Custom Unit',
									'text',
									'nelio-forms'
								) }
								type="text"
								value={ customUnit }
								onChange={ ( value ) =>
									setAttributes( { customUnit: value } )
								}
							/>
							<SelectControl
								label={ _x(
									'Placement',
									'text',
									'nelio-forms'
								) }
								value={ customUnitPosition }
								options={ [
									{
										label: _x(
											'After the value',
											'text',
											'nelio-forms'
										),
										value: 'after',
									},
									{
										label: _x(
											'Before the value',
											'text',
											'nelio-forms'
										),
										value: 'before',
									},
								] }
								onChange={ ( newPosition ) =>
									setAttributes( {
										customUnitPosition: newPosition,
									} )
								}
							/>
						</>
					) }
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
