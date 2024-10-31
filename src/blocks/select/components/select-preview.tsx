/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { SelectControl } from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { isOptionGroup } from '../utils';
import type { Attributes } from '../types';

export const SelectPreview = (
	props: BlockEditProps< Attributes >
): JSX.Element => {
	const { attributes, setAttributes } = props;
	const { disabled, options, placeholder } = attributes;
	const plainOptions = options.reduce(
		( acc, current ) =>
			isOptionGroup( current )
				? [ ...acc, ...current.options ]
				: [ ...acc, current ],
		[]
	);
	const selectedItem = plainOptions.find( ( o ) => o.selected );

	const onChangeSelectedOption = ( selectedValue ) =>
		setAttributes( {
			options: options.map( ( o ) => {
				if ( isOptionGroup( o ) ) {
					return {
						...o,
						options: o.options.map( ( io ) =>
							io.value === selectedValue
								? { ...io, selected: true }
								: { ...io, selected: false }
						),
					};
				} //end if

				return ( o.value || o.label ) === selectedValue
					? { ...o, selected: true }
					: { ...o, selected: false };
			} ),
		} );

	return (
		<SelectControl
			value={
				! selectedItem
					? 'nelio-forms-default'
					: selectedItem.value || selectedItem.label
			}
			disabled={ disabled }
			onChange={ ( selectedValue ) =>
				onChangeSelectedOption( selectedValue )
			}
		>
			{ ! selectedItem && (
				<option hidden disabled value="nelio-forms-default">
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
								disabled={ innerOption.disabled }
								value={ innerOption.value }
							>
								{ innerOption.label || innerOption.label }
							</option>
						) ) }
					</optgroup>
				) : (
					<option
						key={ index }
						disabled={ item.disabled }
						value={ item.value || item.label }
					>
						{ item.label }
					</option>
				)
			) }
		</SelectControl>
	);
};
