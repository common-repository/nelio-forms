/**
 * WordPress dependencies
 */
import { createBlock, BlockInstance } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import block from './block.json';
import type { Attributes as DatetimeAttributes } from '../datetime/types';
import type { Attributes as NumberAttributes } from '../number/types';
import type { Attributes as TextAttributes } from '../text/types';

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/datetime' ],
			transform: ( {
				disabled,
				isLabelHidden,
				label,
				placeholder,
				required,
			}: DatetimeAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					isLabelHidden,
					label,
					placeholder,
					required,
					type: 'textarea',
				} ),
		},
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/number' ],
			transform: ( {
				disabled,
				isLabelHidden,
				label,
				placeholder,
				required,
			}: NumberAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					isLabelHidden,
					label,
					placeholder,
					required,
					type: 'textarea',
				} ),
		},
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/text' ],
			transform: ( {
				disabled,
				isLabelHidden,
				label,
				placeholder,
				minLength,
				maxLength,
				required,
			}: TextAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					isLabelHidden,
					label,
					placeholder,
					minLength,
					maxLength,
					required,
					type: 'textarea',
				} ),
		},
	],
};
export default transforms;
