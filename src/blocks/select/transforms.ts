/**
 * WordPress dependencies
 */
import { createBlock, BlockInstance } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import block from './block.json';
import type { Attributes as CheckboxAttributes } from '../checkbox/types';
import type { Attributes as CheckboxGroupAttributes } from '../checkbox-group/types';
import type { Attributes as RadioGroupAttributes } from '../radio-group/types';

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/checkbox' ],
			transform: ( {
				disabled,
				label,
				required,
			}: CheckboxAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					required,
					isEditingOptions: false,
					options: [
						{
							label,
							value: '',
							selected: false,
							disabled,
						},
					],
					type: 'select',
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
					isEditingOptions: false,
					options: attrs.map( ( { label } ) => ( {
						label,
						value: '',
						selected: false,
						disabled: false,
					} ) ),
					type: 'select',
				} ),
		},
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/checkbox-group' ],
			transform: ( {
				disabled,
				label,
				required,
				options,
			}: CheckboxGroupAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					label,
					required,
					isEditingOptions: false,
					options: options.map( ( { label: optionLabel } ) => ( {
						label: optionLabel,
						value: '',
						selected: false,
						disabled: false,
					} ) ),
					type: 'select',
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
					isEditingOptions: false,
					options: options.map( ( { label: optionLabel } ) => ( {
						label: optionLabel,
						value: '',
						selected: false,
						disabled: false,
					} ) ),
					type: 'select',
				} ),
		},
	],
};
export default transforms;
