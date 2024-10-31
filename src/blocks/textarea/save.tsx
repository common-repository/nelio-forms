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
		minLength,
		maxLength,
		required,
		label,
		...inputAttributes
	} = attributes;

	const applyModifiers = modifiers( { textarea: true, required, disabled } );

	const applyLabelModifiers = modifiers( {
		textarea: true,
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
			{ !! label && ! RichText.isEmpty( label ) && (
				<RichText.Content
					tagName="label"
					className={ applyLabelModifiers(
						'nelio-forms-field__label'
					) }
					htmlFor={ htmlId }
					value={ label }
				/>
			) }
			<textarea
				{ ...inputAttributes }
				id={ htmlId }
				className={ applyModifiers( 'nelio-forms-field__value' ) }
				name={ `nelio_forms[fields][${ id }]` }
				required={ required }
				disabled={ disabled }
				minLength={ minLength }
				maxLength={ maxLength }
			/>
		</div>
	);
};

export default save;
