/**
 * WordPress dependencies
 */
import { createBlock, BlockInstance } from '@wordpress/blocks';

/**
 * External dependencies
 */
import omit from 'lodash/omit';

/**
 * Internal dependencies
 */
import block from './block.json';
import type { Attributes } from './types';
import type { Attributes as DatetimeAttributes } from '../datetime/types';
import type { Attributes as NumberAttributes } from '../number/types';
import type { Attributes as TextareaAttributes } from '../textarea/types';

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/textarea' ],
			transform: ( {
				disabled,
				isLabelHidden,
				label,
				placeholder,
				minLength,
				maxLength,
				required,
			}: TextareaAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					isLabelHidden,
					label,
					placeholder,
					minLength,
					maxLength,
					required,
					type: 'text',
				} ),
		},
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
					type: 'text',
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
					type: 'text',
				} ),
		},
	],
	to: [
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ block.name ],
			isMatch: ( { type }: Attributes ): boolean => type !== 'text',
			transform: ( attrs: Attributes ): BlockInstance =>
				createBlock( block.name, {
					...omit( attrs, [ 'id', 'htmlId' ] ),
					type: 'text',
				} ),
		},
	],
};
export default transforms;
