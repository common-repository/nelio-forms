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
		placeholder,
		confirmationPlaceholder,
		requiresConfirmation,
		minLength,
		maxLength,
		label,
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
			{ 'password' === type && !! requiresConfirmation ? (
				<div className="nelio-forms-field__password--confirmation">
					<div className="nelio-forms-field__password-container">
						<input
							{ ...inputAttributes }
							id={ htmlId }
							type={ type }
							className={ applyModifiers(
								'nelio-forms-field__value'
							) }
							name={ `nelio_forms[fields][${ id }][]` }
							required={ required }
							disabled={ disabled }
							minLength={ minLength }
							maxLength={ maxLength }
							placeholder={ placeholder }
						/>
					</div>
					<div className="nelio-forms-field__password-container">
						<input
							{ ...inputAttributes }
							id={ `${ htmlId }--confirmation` }
							data-match-field={ htmlId }
							type={ type }
							className={ classnames(
								applyModifiers( 'nelio-forms-field__value' ),
								'nelio-forms-field__password--confirmation'
							) }
							name={ `nelio_forms[fields][${ id }][]` }
							required={ required }
							disabled={ disabled }
							minLength={ minLength }
							maxLength={ maxLength }
							placeholder={ confirmationPlaceholder }
						/>
					</div>
				</div>
			) : (
				<input
					{ ...inputAttributes }
					id={ htmlId }
					type={ type }
					className={ applyModifiers( 'nelio-forms-field__value' ) }
					name={ `nelio_forms[fields][${ id }]` }
					required={ required }
					disabled={ disabled }
					minLength={ minLength }
					maxLength={ maxLength }
					placeholder={ placeholder }
				/>
			) }
		</div>
	);
};

export default save;
