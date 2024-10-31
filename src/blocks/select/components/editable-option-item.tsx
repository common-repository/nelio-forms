/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { KeyboardEventHandler } from 'react';
import { Button, CheckboxControl } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { OptionLabel } from '@nelio/forms/components';
import { css } from '@nelio/forms/css';

/**
 * Internal dependencies
 */
import type { OptionItem } from '../types';

type EditableOptionItemProps = {
	readonly option: OptionItem;
	readonly isLabelOnFocus: boolean;
	readonly isValueOnFocus: boolean;
	readonly isDisabled?: boolean;
	readonly isRemoveDisabled: boolean;
	readonly onFocusLabel: () => void;
	readonly onFocusValue: () => void;
	readonly onSelectedChange: ( selected: boolean ) => void;
	readonly onChange: ( o: OptionItem ) => void;
	readonly onRemove: () => void;
	readonly onKeyDown?: KeyboardEventHandler< HTMLInputElement >;
};
export const EditableOptionItem = (
	props: EditableOptionItemProps
): JSX.Element => {
	const {
		option,
		isLabelOnFocus,
		isValueOnFocus,
		isDisabled,
		isRemoveDisabled,
		onFocusLabel,
		onFocusValue,
		onSelectedChange,
		onChange,
		onRemove,
		onKeyDown,
	} = props;
	const { label, selected, disabled, value } = option;

	return (
		<div
			className={ classnames(
				OPTION_ITEM,
				'nelio-form-field__value--select-option-item'
			) }
		>
			<CheckboxControl
				className="nelio-forms-field__select-option-item-checker"
				checked={ selected }
				autoComplete="off"
				disabled={ disabled }
				onChange={ onSelectedChange }
			/>
			<OptionLabel
				className={ LABEL }
				label={ label }
				isInFocus={ isLabelOnFocus }
				onFocus={ onFocusLabel }
				onChange={ ( newValue ) =>
					onChange( { ...option, label: newValue } )
				}
				onKeyDown={ onKeyDown }
			/>
			<OptionLabel
				className={ VALUE }
				label={ value }
				placeholder={ _x( 'Type value here…', 'user', 'nelio-forms' ) }
				isInFocus={ isValueOnFocus }
				onFocus={ onFocusValue }
				onChange={ ( newValue ) =>
					onChange( { ...option, value: newValue } )
				}
				onKeyDown={ onKeyDown }
			/>
			<Button
				className={ ACTION }
				icon={ isDisabled || disabled ? 'lock' : 'unlock' }
				label={
					isDisabled || disabled
						? _x( 'Enable option', 'command', 'nelio-forms' )
						: _x( 'Disable option', 'command', 'nelio-forms' )
				}
				showTooltip={ true }
				isPressed={ isDisabled || disabled }
				onClick={ () =>
					onChange( { ...option, disabled: ! disabled } )
				}
			/>
			<Button
				className={ ACTION }
				icon="trash"
				label={ _x( 'Remove option', 'command', 'nelio-forms' ) }
				showTooltip={ true }
				disabled={ isRemoveDisabled }
				onClick={ onRemove }
			/>
		</div>
	);
};

// ======
// STYLES
// ======

const OPTION_ITEM = css( {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
} );

const LABEL = css( {
	flexGrow: '1',
	marginRight: '1em',
} );

const VALUE = css( {
	flexGrow: '1',
} );

const ACTION = css( {
	paddingTop: '0 !important',

	':focus': {
		boxShadow: 'none !important',
	},

	'&.is-pressed, &.is-pressed:hover:not(:disabled)': {
		background: 'transparent',
		color: '#1e1e1e;',
	},
} );
