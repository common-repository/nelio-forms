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
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		type,
		label,
		isLabelHidden,
		options,
		...inputAttributes
	} = attributes;

	const applyModifiers = modifiers( {
		'radio-group': true,
		required,
		disabled,
	} );

	const applyLabelModifiers = modifiers( {
		'radio-group': true,
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
			<div
				id={ htmlId }
				className={ applyModifiers( 'nelio-forms-field__value' ) }
			>
				{ options.map( ( option, index ) => (
					<div
						key={ index }
						className={ applyModifiers(
							'nelio-forms-field__item'
						) }
					>
						<input
							{ ...inputAttributes }
							id={ `${ htmlId }-item-${ index }` }
							type="radio"
							className={ applyModifiers(
								'nelio-forms-field__item-value'
							) }
							name={ `nelio_forms[fields][${ id }]` }
							value={ index }
							required={ required }
							disabled={ disabled }
							checked={ option.checked }
						/>
						{ option.label.length && (
							<label
								className={ applyModifiers(
									'nelio-forms-field__item-label'
								) }
								htmlFor={ `${ htmlId }-item-${ index }` }
							>
								{ option.label }
							</label>
						) }
					</div>
				) ) }
			</div>
		</div>
	);
};

export default save;
