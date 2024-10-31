/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import {
	TextControl,
	TextareaControl,
	BaseControl,
} from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

/**
 * External dependencies
 */
import { css } from '@nelio/forms/css';

/**
 * Internal dependencies
 */
import { SmartFieldTagsControl } from './smart-field-tags-control';

export type TextFieldControlProps = {
	readonly label: string;
	readonly value: string;
	readonly help?: string;
	readonly isMultiline?: boolean;
	readonly type?: string;
	readonly maxLength?: number;
	readonly onChange: ( value: string ) => void;
};
export const TextFieldControl = (
	props: TextFieldControlProps
): JSX.Element => {
	const {
		label,
		help,
		value,
		isMultiline = false,
		maxLength,
		onChange,
		type,
	} = props;
	const instanceId = useInstanceId( TextFieldControl );
	return (
		<BaseControl
			id={ `${ instanceId }` }
			className={ FIELD_CONTROL }
			label={ label }
			help={ help }
		>
			{ !! isMultiline ? (
				<TextareaControl value={ value } onChange={ onChange } />
			) : (
				<TextControl
					value={ value }
					maxLength={ maxLength }
					onChange={ onChange }
				/>
			) }
			<SmartFieldTagsControl
				value={ value }
				type={ type }
				onChange={ onChange }
			/>
		</BaseControl>
	);
};

// ======
// STYLES
// ======

const FIELD_CONTROL = css( {
	position: 'relative',
} );
