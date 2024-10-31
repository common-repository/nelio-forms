/**
 * WordPress dependencies
 */
import { createBlock, BlockInstance } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import block from './block.json';
import { isOptionGroup } from '../select/utils';
import type { Attributes as CheckboxAttributes } from '../checkbox/types';
import type { Attributes as RadioGroupAttributes } from '../radio-group/types';
import type { Attributes as SelectAttributes } from '../select/types';

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/checkbox' ],
			transform: ( {
				checked,
				disabled,
				label,
				required,
			}: CheckboxAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					required,
					options: [ { label, checked } ],
					type: 'checkbox-group',
				} ),
		},
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'nelio-forms/checkbox' ],
			transform: ( attrs: CheckboxAttributes[] ): BlockInstance =>
				createBlock( block.name, {
					disabled: attrs.every( ( attr ) => attr.disabled ),
					required: attrs.every( ( attr ) => attr.required ),
					options: attrs.map( ( { checked, label } ) => ( {
						label,
						checked,
					} ) ),
					type: 'checkbox-group',
				} ),
		},
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/radio-group' ],
			transform: ( {
				disabled,
				label,
				required,
				options,
			}: RadioGroupAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					label,
					required,
					options,
					type: 'checkbox-group',
				} ),
		},
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/select' ],
			transform: ( {
				disabled,
				label,
				required,
				options,
			}: SelectAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					label,
					required,
					type: 'checkbox-group',
					options: options.reduce( ( acc, item ) => {
						if ( isOptionGroup( item ) ) {
							return [
								...acc,
								...item.options.map(
									( { label: optionLabel, selected } ) => ( {
										label: optionLabel,
										checked: selected,
									} )
								),
							];
						} //end if

						return [
							...acc,
							{ label: item.label, checked: item.selected },
						];
					}, [] ),
				} ),
		},
	],
};
export default transforms;
