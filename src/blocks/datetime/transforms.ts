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
import type { Attributes as NumberAttributes } from '../number/types';
import type { Attributes as TextAttributes } from '../text/types';
import type { Attributes as TextareaAttributes } from '../textarea/types';

const transforms = {
	from: [
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
					type: 'datetime',
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
				required,
			}: TextAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					isLabelHidden,
					label,
					placeholder,
					required,
					type: 'datetime',
				} ),
		},
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ 'nelio-forms/textarea' ],
			transform: ( {
				disabled,
				isLabelHidden,
				label,
				placeholder,
				required,
			}: TextareaAttributes ): BlockInstance =>
				createBlock( block.name, {
					disabled,
					isLabelHidden,
					label,
					placeholder,
					required,
					type: 'datetime',
				} ),
		},
	],
	to: [
		{
			type: 'block',
			isMultiBlock: false,
			blocks: [ block.name ],
			isMatch: ( { type }: Attributes ): boolean => type !== 'datetime',
			transform: ( attrs: Attributes ): BlockInstance =>
				createBlock( block.name, {
					...omit( attrs, [ 'id', 'htmlId' ] ),
					type: 'datetime',
				} ),
		},
	],
};
export default transforms;
