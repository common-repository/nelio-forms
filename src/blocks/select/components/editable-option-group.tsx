/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { OptionLabel } from '@nelio/forms/components';
import { css } from '@nelio/forms/css';

/**
 * Internal dependencies
 */
import { EditableOptionItem } from './editable-option-item';
import type { OptionGroup, OptionItem } from '../types';

type EditableOptionGroupProps = {
	readonly option: OptionGroup;
	readonly isInFocus: boolean;
	readonly isRemoveDisabled: boolean;
	readonly onFocus: () => void;
	readonly onChange: ( o: OptionGroup ) => void;
	readonly onRemove: () => void;
};
export const EditableOptionGroup = (
	props: EditableOptionGroupProps
): JSX.Element => {
	const { option, isInFocus, isRemoveDisabled, onChange, onFocus, onRemove } =
		props;
	const { label, disabled, options } = option;

	const [ indexInFocus, setIndexInFocus ] = useState< number | null >( null );
	const [ fieldInFocus, setFieldInFocus ] = useState< 'label' | 'value' >(
		'label'
	);

	const onRemoveInnerOption = ( idx: number ) =>
		onChange( {
			...option,
			options: options.filter( ( _, i ) => i !== idx ),
		} );

	const onChangeInnerOption = ( opt: OptionItem, idx: number ) =>
		onChange( {
			...option,
			options: options.map( ( o, i ) => {
				if ( i === idx ) {
					return opt;
				} //end if
				return opt.selected ? { ...o, selected: false } : o;
			} ),
		} );

	const onEnterPressed = ( target: HTMLInputElement, index: number ) => {
		onChange( {
			...option,
			options: options.reduce(
				( acc, o, i ) =>
					i === index
						? [
								...acc,
								...splitOptionItem(
									o,
									target.selectionStart,
									target.selectionEnd,
									fieldInFocus
								),
						  ]
						: [ ...acc, o ],
				[]
			),
		} );
		setIndexInFocus( index + 1 );
	};

	const onRemovePressed = (
		key: 'Backspace' | 'Delete',
		target: HTMLInputElement,
		index: number
	): boolean => {
		const start = target.selectionStart;
		const end = target.selectionEnd;
		if ( start !== end ) {
			return false;
		} //end if

		const isBackspaceJoin = key === 'Backspace' && start === 0;
		const isDeleteJoin =
			key === 'Delete' &&
			end ===
				( fieldInFocus === 'label'
					? options[ index ].label.length
					: options[ index ].value.length );

		if ( index === 0 ) {
			if ( ! isDeleteJoin || options.length < 2 ) {
				return false;
			} //end if

			const [ c, n, ...r ] = options;
			onChange( {
				...option,
				options: [ joinOptionItems( c, n, fieldInFocus ), ...r ],
			} );
			return true;
		} //end if

		if ( index === options.length - 1 ) {
			if ( ! isBackspaceJoin || options.length < 2 ) {
				return false;
			} //end if

			const [ l, p, ...r ] = [ ...options ].reverse();

			onChange( {
				...option,
				options: [
					joinOptionItems( p, l, fieldInFocus ),
					...r,
				].reverse(),
			} );
			setIndexInFocus( index - 1 );
			return true;
		} //end if

		if ( isBackspaceJoin ) {
			const f = options.slice( 0, index - 1 );
			const p = options[ index - 1 ];
			const c = options[ index ];
			const r = options.slice( index + 1 );

			onChange( {
				...option,
				options: [ ...f, joinOptionItems( p, c, fieldInFocus ), ...r ],
			} );
			setIndexInFocus( index - 1 );
			return true;
		} //end if

		if ( isDeleteJoin ) {
			const f = options.slice( 0, index );
			const c = options[ index ];
			const n = options[ index + 1 ];
			const r = options.slice( index + 2 );

			onChange( {
				...option,
				options: [ ...f, joinOptionItems( c, n, fieldInFocus ), ...r ],
			} );
			return true;
		} //end if

		return false;
	};

	return (
		<div className={ GROUP_CONTAINER }>
			<div className={ OPTION_GROUP }>
				<OptionLabel
					className={ LABEL }
					label={ label }
					placeholder={ _x(
						'Type group label here…',
						'user',
						'nelio-forms'
					) }
					onChange={ ( newValue ) =>
						onChange( { ...option, label: newValue } )
					}
				/>
				<Button
					className={ ACTION }
					icon={ disabled ? 'lock' : 'unlock' }
					label={
						disabled
							? _x( 'Enable group', 'command', 'nelio-forms' )
							: _x( 'Disable group', 'command', 'nelio-forms' )
					}
					showTooltip={ true }
					isPressed={ disabled }
					onClick={ () =>
						onChange( { ...option, disabled: ! disabled } )
					}
				/>
				<Button
					className={ ACTION }
					icon="trash"
					label={ _x( 'Remove group', 'command', 'nelio-forms' ) }
					showTooltip={ true }
					disabled={ isRemoveDisabled }
					onClick={ onRemove }
				/>
			</div>
			<div className={ LIST }>
				{ options.map( ( innerOption, index ) => (
					<EditableOptionItem
						key={ index }
						option={ innerOption }
						isLabelOnFocus={
							isInFocus &&
							index === indexInFocus &&
							'label' === fieldInFocus
						}
						isValueOnFocus={
							isInFocus &&
							index === indexInFocus &&
							'value' === fieldInFocus
						}
						isDisabled={ disabled }
						isRemoveDisabled={ options.length < 2 }
						onFocusLabel={ () => {
							onFocus();
							setIndexInFocus( index );
							setFieldInFocus( 'label' );
						} }
						onFocusValue={ () => {
							onFocus();
							setIndexInFocus( index );
							setFieldInFocus( 'value' );
						} }
						onSelectedChange={ ( selected ) =>
							onChangeInnerOption(
								{ ...innerOption, selected },
								index
							)
						}
						onChange={ ( newOption ) =>
							onChangeInnerOption( newOption, index )
						}
						onRemove={ () => onRemoveInnerOption( index ) }
						onKeyDown={ ( event ) => {
							const { key } = event;
							const target = event.target as HTMLInputElement;
							if ( 'Enter' === key ) {
								onEnterPressed( target, index );
							} //end if

							if ( 'Backspace' === key || 'Delete' === key ) {
								if ( onRemovePressed( key, target, index ) ) {
									event.preventDefault();
								} //end if
							} //end if

							if ( 'ArrowDown' === key ) {
								setIndexInFocus(
									Math.min( options.length, index + 1 )
								);
							} //end if

							if ( 'ArrowUp' === key ) {
								setIndexInFocus( Math.max( 0, index - 1 ) );
							} //end if

							if (
								'ArrowRight' === key &&
								fieldInFocus === 'label' &&
								target.selectionStart === target.selectionEnd &&
								target.selectionStart ===
									innerOption.label.length
							) {
								setFieldInFocus( 'value' );
							}

							if (
								'ArrowLeft' === key &&
								fieldInFocus === 'value' &&
								target.selectionStart === target.selectionEnd &&
								target.selectionStart === 0
							) {
								setFieldInFocus( 'label' );
							}
						} }
					/>
				) ) }
				<Button
					className="nelio-forms-field__action"
					icon="insert"
					onClick={ () =>
						onChange( {
							...option,
							options: [
								...option.options,
								{
									label: '',
									value: '',
									selected: false,
									disabled: false,
								},
							],
						} )
					}
				>
					{ _x( 'Add option in group', 'command', 'nelio-forms' ) }
				</Button>
			</div>
		</div>
	);
};

// =======
// HELPERS
// =======

const splitOptionItem = (
	option: OptionItem,
	start: number | null,
	end: number | null,
	fieldInFocus: 'label' | 'value'
) => {
	return [
		{
			...option,
			...( fieldInFocus === 'label' && {
				label:
					start !== null
						? option.label.substring( 0, start )
						: option.label,
			} ),
			...( fieldInFocus === 'value' && {
				value:
					start !== null
						? option.value.substring( 0, start )
						: option.value,
			} ),
		},
		{
			selected: false,
			disabled: false,
			label: '',
			value: '',
			...( fieldInFocus === 'label' && {
				label: end !== null ? option.label.substring( end ) : '',
			} ),
			...( fieldInFocus === 'value' && {
				value: end !== null ? option.value.substring( end ) : '',
			} ),
		},
	];
};

const joinOptionItems = (
	o1: OptionItem,
	o2: OptionItem,
	fieldInFocus: 'label' | 'value'
): OptionItem => {
	if ( ! o2 ) {
		return { ...o1 };
	} //end if

	return {
		label: '',
		value: '',
		...( fieldInFocus === 'label' && {
			label: o1.label + o2.label,
			value: o1.value,
		} ),
		...( fieldInFocus === 'value' && {
			value: o1.value + o2.value,
			label: o1.label,
		} ),
		disabled: o1.disabled || o2.disabled,
		selected: o1.selected || o2.selected,
	};
};

// ======
// STYLES
// ======

const GROUP_CONTAINER = css( {
	border: '1px solid #757575',
	padding: '0.5em',
	marginBottom: '0.5em',

	'&+div.nelio-form-field__value--select-option-item': {
		'> :nth-child(1):before': {
			content: `" "`,
			whiteSpace: 'pre',
		},
		'> :nth-child(2):before': {
			content: `"${ _x( 'Label', 'text', 'nelio-forms' ) }"`,
		},
		'> :nth-child(3):before': {
			content: `"${ _x( 'Value', 'text', 'nelio-forms' ) }"`,
		},
		'> :nth-child(4), > :nth-child(5)': {
			paddingTop: '1em !important',
		},
	},
} );

const OPTION_GROUP = css( {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
} );

const LABEL = css( {
	flexGrow: '1',
	marginRight: '1em',
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

const LIST = css( {
	marginTop: '0.5em',

	'> div:first-child': {
		'> :nth-child(1):before': {
			content: `" "`,
			whiteSpace: 'pre',
		},
		'> :nth-child(2):before': {
			content: `"${ _x( 'Label', 'text', 'nelio-forms' ) }"`,
		},
		'> :nth-child(3):before': {
			content: `"${ _x( 'Value', 'text', 'nelio-forms' ) }"`,
		},
		'> :nth-child(4), > :nth-child(5)': {
			paddingTop: '1em !important',
		},
	},
} );
