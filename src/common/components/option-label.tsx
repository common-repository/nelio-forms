/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { useEffect, useRef } from '@wordpress/element';
import { KeyboardEventHandler } from 'react';
import { TextControl } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

export type OptionLabelProps = {
	readonly className: string;
	readonly label: string;
	readonly onChange: ( label: string ) => void;
	readonly placeholder?: string;
	readonly onKeyDown?: KeyboardEventHandler< HTMLInputElement >;
	readonly onFocus?: () => void;
	readonly isInFocus?: boolean;
};

export const OptionLabel = ( {
	className,
	label,
	onChange,
	placeholder,
	onFocus,
	onKeyDown,
	isInFocus,
}: OptionLabelProps ): JSX.Element => {
	const ref = useRef( null );

	useEffect( () => {
		if ( isInFocus && ref && ref.current ) {
			( ref.current as HTMLElement ).focus();
		} //end if
	}, [ isInFocus ] );

	return (
		<TextControl
			type="text"
			ref={ ref }
			className={ className }
			placeholder={
				placeholder ?? _x( 'Type label here…', 'user', 'nelio-forms' )
			}
			value={ label }
			onChange={ onChange }
			onFocus={ onFocus }
			onKeyDown={ onKeyDown }
		/>
	);
};
