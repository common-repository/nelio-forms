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
import { isOptionGroup } from './utils';
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
		options,
		placeholder,
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

	const isThereAnOptionSelected = !! options.find( ( o ) =>
		isOptionGroup( o )
			? !! o.options.find( ( io ) => io.selected )
			: o.selected
	);

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
			<select
				{ ...inputAttributes }
				id={ htmlId }
				className={ applyModifiers( 'nelio-forms-field__value' ) }
				name={ `nelio_forms[fields][${ id }]` }
				required={ required }
				disabled={ disabled }
			>
				{ ! isThereAnOptionSelected && (
					<option hidden disabled selected>
						{ placeholder }
					</option>
				) }
				{ options.map( ( item, index ) =>
					isOptionGroup( item ) ? (
						<optgroup
							key={ index }
							label={ item.label }
							disabled={ item.disabled }
						>
							{ item.options.map( ( innerOption, innerIndex ) => (
								<option
									key={ innerIndex }
									selected={ innerOption.selected }
									disabled={ innerOption.disabled }
									value={
										innerOption.value || innerOption.label
									}
								>
									{ innerOption.label }
								</option>
							) ) }
						</optgroup>
					) : (
						<option
							key={ index }
							selected={ item.selected }
							disabled={ item.disabled }
							value={ item.value || item.label }
						>
							{ item.label }
						</option>
					)
				) }
			</select>
		</div>
	);
};

export default save;
