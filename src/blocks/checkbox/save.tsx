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
		required,
		checked,
		type,
		label,
		...inputAttributes
	} = attributes;

	const applyModifiers = modifiers( {
		checkbox: true,
		required,
		disabled,
	} );

	const blockProps = useBlockProps.save( {
		className: classnames(
			className,
			applyModifiers( 'nelio-forms-field' )
		),
	} );

	return (
		<div { ...blockProps }>
			<input
				{ ...inputAttributes }
				id={ htmlId }
				type={ type }
				className={ applyModifiers( 'nelio-forms-field__value' ) }
				name={ `nelio_forms[fields][${ id }]` }
				checked={ checked }
				required={ required }
				disabled={ disabled }
			/>
			{ ! RichText.isEmpty( label ) && (
				<RichText.Content
					tagName="label"
					className={ applyModifiers( 'nelio-forms-field__label' ) }
					htmlFor={ htmlId }
					value={ label }
				/>
			) }
		</div>
	);
};

export default save;
