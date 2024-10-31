/**
 * WordPress dependencies
 */
import { createBlock, BlockInstance } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import block from './block.json';
import { isOptionGroup } from '../select/utils';
import type { Attributes as CheckboxGroupAttributes } from '../checkbox-group/types';
import type { Attributes as RadioGroupAttributes } from '../radio-group/types';
import type { Attributes as SelectAttributes } from '../select/types';

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/checkbox-group' ],
			transform: ( {
				disabled,
				required,
				options,
			}: CheckboxGroupAttributes ): BlockInstance[] =>
				options.map( ( { label, checked } ) =>
					createBlock( block.name, {
						disabled,
						label,
						checked,
						required,
						type: 'checkbox',
					} )
				),
		},
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/radio-group' ],
			transform: ( {
				disabled,
				required,
				options,
			}: RadioGroupAttributes ): BlockInstance[] =>
				options.map( ( { label, checked } ) =>
					createBlock( block.name, {
						disabled,
						label,
						checked,
						required,
						type: 'checkbox',
					} )
				),
		},
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/select' ],
			transform: ( {
				required,
				options,
			}: SelectAttributes ): BlockInstance[] =>
				options.reduce( ( acc, item ) => {
					if ( isOptionGroup( item ) ) {
						return [
							...acc,
							...item.options.map(
								( { label, selected, disabled } ) =>
									createBlock( block.name, {
										disabled,
										label,
										checked: selected,
										required,
										type: 'checkbox',
									} )
							),
						];
					} //end if

					return [
						...acc,
						createBlock( block.name, {
							disabled: item.disabled,
							label: item.label,
							checked: item.selected,
							required,
							type: 'checkbox',
						} ),
					];
					//end if
				}, [] ),
		},
	],
};
export default transforms;
