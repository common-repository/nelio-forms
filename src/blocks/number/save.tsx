/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { RichText, useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { modifiers } from '@nelio/forms/utils';

/**
 * Internal dependencies
 */
import type { Attributes } from './types';

type SaveProps = {
	readonly className: string;
	readonly attributes: Attributes;
};

const save = ( { className, attributes }: SaveProps ): JSX.Element => {
	const {
		id,
		htmlId,
		disabled,
		isLabelHidden,
		required,
		type,
		label,
		min,
		max,
		step,
		value,
		showCustomUnit,
		customUnit,
		customUnitPosition = 'after',
		...inputAttributes
	} = attributes;

	const applyModifiers = modifiers( {
		[ type ]: !! type,
		required,
		disabled,
	} );

	const applyLabelModifiers = modifiers( {
		[ type ]: !! type,
		required,
		disabled,
		hidden: isLabelHidden,
	} );

	const blockProps = useBlockProps.save( {
		className: classnames(
			className,
			applyModifiers( 'nelio-forms-field' )
		),
	} );

	return (
		<div { ...blockProps }>
			{ ! RichText.isEmpty( label ) && (
				<RichText.Content
					tagName="label"
					className={ applyLabelModifiers(
						'nelio-forms-field__label'
					) }
					htmlFor={ htmlId }
					value={ label }
				/>
			) }
			<ConditionalWrapper
				condition={ type === 'number-slider' }
				wrapper={ ( children ) => (
					<div className="nelio-forms-field__value-container">
						{ children }
					</div>
				) }
			>
				<>
					<input
						{ ...inputAttributes }
						id={ htmlId }
						type={ type === 'number-slider' ? 'range' : type }
						className={ applyModifiers(
							'nelio-forms-field__value'
						) }
						name={ `nelio_forms[fields][${ id }]` }
						required={ required }
						disabled={ disabled }
						min={ min }
						max={ max }
						step={ step }
						value={ value }
					/>
					{ type === 'number-slider' && (
						<output
							className={ applyModifiers(
								'nelio-forms-field__value-output'
							) }
						>
							{ !! showCustomUnit &&
								customUnitPosition === 'before' && (
									<span
										className={ applyModifiers(
											'nelio-forms-field__value-output-unit'
										) }
									>
										{ customUnit }
									</span>
								) }
							<span
								className={ applyModifiers(
									'nelio-forms-field__value-output-numeric'
								) }
							>
								{ value }
							</span>
							{ !! showCustomUnit &&
								customUnitPosition === 'after' && (
									<span
										className={ applyModifiers(
											'nelio-forms-field__value-output-unit'
										) }
									>
										{ customUnit }
									</span>
								) }
						</output>
					) }
				</>
			</ConditionalWrapper>
		</div>
	);
};

type ConditionalWrapperProps = {
	readonly condition: boolean;
	readonly wrapper: ( children: JSX.Element ) => JSX.Element;
	readonly children: JSX.Element;
};
const ConditionalWrapper = ( {
	condition,
	wrapper,
	children,
}: ConditionalWrapperProps ): JSX.Element =>
	condition ? wrapper( children ) : children;

export default save;
