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

	const inputType = type === 'datetime' ? 'datetime-local' : type;

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
			<input
				{ ...inputAttributes }
				id={ htmlId }
				type={ inputType }
				className={ applyModifiers( 'nelio-forms-field__value' ) }
				name={ `nelio_forms[fields][${ id }]` }
				required={ required }
				disabled={ disabled }
				min={ min }
				max={ max }
				step={ step }
				value={ value }
			/>
		</div>
	);
};

export default save;
