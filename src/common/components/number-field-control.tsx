/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { TextControl, BaseControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';

/**
 * External dependencies
 */
import { css } from '@nelio/forms/css';

/**
 * Internal dependencies
 */
import { SmartFieldTagsControl } from './smart-field-tags-control';

export type NumberFieldControlProps = {
	readonly label: string;
	readonly value: string;
	readonly help?: string;
	readonly onChange: ( value: string ) => void;
};
export const NumberFieldControl = (
	props: NumberFieldControlProps
): JSX.Element => {
	const { label, help, value, onChange } = props;
	const instanceId = useInstanceId( NumberFieldControl );
	return (
		<BaseControl
			id={ `${ instanceId }` }
			className={ FIELD_CONTROL }
			label={ label }
			help={ help }
		>
			<TextControl value={ value } type="text" onChange={ onChange } />
			<SmartFieldTagsControl
				value={ value }
				type="number"
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
