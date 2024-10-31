/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ItemSelectControl } from './internal/item-select-control';

export type PostSelectControlProps = {
	readonly postType: string;
	readonly label?: string;
	readonly placeholder?: string;
	readonly value: ReadonlyArray< number >;
	readonly onChange: ( value: ReadonlyArray< number > ) => void;
	readonly isSingle?: boolean;
	readonly disabled?: boolean;
};

export const PostSelectControl = ( {
	postType,
	label,
	placeholder,
	value,
	isSingle,
	disabled,
	onChange,
}: PostSelectControlProps ): JSX.Element => {
	return (
		<ItemSelectControl
			kind="postType"
			label={ label }
			placeholder={ placeholder }
			name={ postType }
			value={ value }
			isSingle={ isSingle }
			disabled={ disabled }
			onChange={ onChange }
		/>
	);
};
