/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { useState } from '@wordpress/element';
import {
	BaseControl,
	Button,
	Dashicon,
	DropdownMenu,
	TextControl,
} from '@wordpress/components';
import type { BlockEditProps } from '@wordpress/blocks';
import { useInstanceId } from '@wordpress/compose';
import { applyFilters } from '@wordpress/hooks';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { countries, languages, months } from '@nelio/forms/data';
import { css } from '@nelio/forms/css';

/**
 * Internal dependencies
 */
import { EditableOptionItem } from './editable-option-item';
import { EditableOptionGroup } from './editable-option-group';
import { isOptionGroup } from '../utils';
import type { Attributes, OptionGroup, OptionItem } from '../types';

export const EditableOptionList = (
	props: BlockEditProps< Attributes >
): JSX.Element => {
	const { attributes, setAttributes, isSelected } = props;
	const { options, placeholder } = attributes;

	const [ indexInFocus, setIndexInFocus ] = useState< number | null >( null );
	const [ fieldInFocus, setFieldInFocus ] = useState< 'label' | 'value' >(
		'label'
	);

	const onRemove = ( idx: number ) =>
		setAttributes( {
			options: options.filter( ( _, i ) => i !== idx ),
		} );

	const onChange = ( option: OptionItem | OptionGroup, idx: number ) => {
		setAttributes( {
			options: options.map( ( o, i ) => {
				if ( i === idx ) {
					return option;
				} //end if
				return hasSelected( option ) ? deselect( o ) : o;
			} ),
		} );
	};

	const onEnterPressedInOptionItem = (
		target: HTMLInputElement,
		index: number
	) => {
		setAttributes( {
			options: options.reduce(
				( acc, o, i ) =>
					i === index && ! isOptionGroup( o )
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

	const onRemovePressedInOptionItem = (
		key: 'Backspace' | 'Delete',
		target: HTMLInputElement,
		index: number
	): boolean => {
		const start = target.selectionStart;
		const end = target.selectionEnd;
		if ( start !== end ) {
			return false;
		} //end if

		const option = options[ index ];
		const isBackspaceJoin = key === 'Backspace' && start === 0;
		const isDeleteJoin =
			key === 'Delete' &&
			! isOptionGroup( option ) &&
			end ===
				( fieldInFocus === 'label'
					? option.label.length
					: option.value.length );

		if ( index === 0 ) {
			if ( ! isDeleteJoin || options.length < 2 ) {
				return false;
			} //end if

			const [ c, n, ...r ] = options;
			if ( isOptionGroup( c ) || isOptionGroup( n ) ) {
				return false;
			} //end if
			setAttributes( {
				options: [ joinOptionItems( c, n, fieldInFocus ), ...r ],
			} );
			return true;
		} //end if

		if ( index === options.length - 1 ) {
			if ( ! isBackspaceJoin || options.length < 2 ) {
				return false;
			} //end if

			const [ l, p, ...r ] = [ ...options ].reverse();
			if ( isOptionGroup( p ) || isOptionGroup( l ) ) {
				return false;
			} //end if

			setAttributes( {
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

			if ( isOptionGroup( p ) || isOptionGroup( c ) ) {
				return false;
			} //end if

			setAttributes( {
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

			if ( isOptionGroup( c ) || isOptionGroup( n ) ) {
				return false;
			} //end if

			setAttributes( {
				options: [ ...f, joinOptionItems( c, n, fieldInFocus ), ...r ],
			} );
			return true;
		} //end if

		return false;
	};

	type Preset = {
		readonly title: string;
		readonly icon: Dashicon.Icon | JSX.Element;
		readonly id: string;
		readonly options: ReadonlyArray< OptionItem >;
	};
	const presets = applyFilters( 'nelio_forms.get_preset_options', [
		{
			title: _x( 'Countries', 'text', 'nelio-forms' ),
			icon: 'admin-site',
			id: 'countries',
			options: Object.keys( countries ).map( ( key ) => ( {
				label: countries[ key ],
				value: key,
				selected: false,
				disabled: false,
			} ) ),
		},
		{
			title: _x( 'Languages', 'text', 'nelio-forms' ),
			icon: 'translation',
			id: 'languages',
			options: Object.keys( languages ).map( ( key ) => ( {
				label: languages[ key ],
				value: key,
				selected: false,
				disabled: false,
			} ) ),
		},
		{
			title: _x( 'Months', 'text', 'nelio-forms' ),
			icon: 'calendar',
			id: 'month',
			options: Object.keys( months ).map( ( key ) => ( {
				label: months[ key ],
				value: key,
				selected: false,
				disabled: false,
			} ) ),
		},
	] ) as ReadonlyArray< Preset >;

	const onPresetSelected = ( presetId: string ) => {
		setAttributes( {
			options: [
				...options,
				...( presets.find( ( p ) => p.id === presetId )?.options ??
					[] ),
			],
		} );
	};

	const presetControls = presets.map( ( { title, icon, id } ) => ( {
		title,
		icon,
		onClick: () => onPresetSelected( id ),
	} ) );

	const instanceId = useInstanceId( EditableOptionList );

	const isThereAnOptionSelected = !! options.find( ( o ) =>
		isOptionGroup( o )
			? !! o.options.find( ( io ) => io.selected )
			: o.selected
	);

	return (
		<div className={ CONTAINER }>
			{ ! isThereAnOptionSelected && (
				<TextControl
					value={ placeholder }
					label={ _x( 'Placeholder', 'text', 'nelio-forms' ) }
					placeholder={ _x(
						'Type placeholder here…',
						'command',
						'nelio-forms'
					) }
					onChange={ ( value ) =>
						setAttributes( { placeholder: value } )
					}
				/>
			) }
			<BaseControl
				id={ `nelio-form-field__value--select-option-list-${ instanceId }` }
				label={ _x( 'Options', 'text', 'nelio-forms-premium' ) }
			>
				<div className={ LIST }>
					{ options.map( ( option, index ) =>
						isOptionGroup( option ) ? (
							<EditableOptionGroup
								key={ index }
								option={ option }
								isInFocus={
									isSelected && indexInFocus === index
								}
								onFocus={ () => setIndexInFocus( index ) }
								isRemoveDisabled={ options.length < 2 }
								onChange={ ( newOption ) =>
									onChange( newOption, index )
								}
								onRemove={ () => onRemove( index ) }
							/>
						) : (
							<EditableOptionItem
								key={ index }
								option={ option }
								isLabelOnFocus={
									isSelected &&
									index === indexInFocus &&
									'label' === fieldInFocus
								}
								isValueOnFocus={
									isSelected &&
									index === indexInFocus &&
									'value' === fieldInFocus
								}
								isRemoveDisabled={ options.length < 2 }
								onFocusLabel={ () => {
									setIndexInFocus( index );
									setFieldInFocus( 'label' );
								} }
								onFocusValue={ () => {
									setIndexInFocus( index );
									setFieldInFocus( 'value' );
								} }
								onSelectedChange={ ( selected ) =>
									onChange( { ...option, selected }, index )
								}
								onChange={ ( newOption ) =>
									onChange( newOption, index )
								}
								onRemove={ () => onRemove( index ) }
								onKeyDown={ ( event ) => {
									const { key } = event;
									const target = event.target as HTMLInputElement;
									if (
										'Enter' === key &&
										! isOptionGroup( option )
									) {
										onEnterPressedInOptionItem(
											target,
											index
										);
									} //end if

									if (
										( 'Backspace' === key ||
											'Delete' === key ) &&
										! isOptionGroup( option )
									) {
										if (
											onRemovePressedInOptionItem(
												key,
												target,
												index
											)
										) {
											event.preventDefault();
										} //end if
									} //end if

									if ( 'ArrowDown' === key ) {
										setIndexInFocus(
											Math.min(
												options.length,
												index + 1
											)
										);
									} //end if

									if ( 'ArrowUp' === key ) {
										setIndexInFocus(
											Math.max( 0, index - 1 )
										);
									} //end if

									if (
										'ArrowRight' === key &&
										fieldInFocus === 'label' &&
										target.selectionStart ===
											target.selectionEnd &&
										target.selectionStart ===
											option.label.length
									) {
										setFieldInFocus( 'value' );
									}

									if (
										'ArrowLeft' === key &&
										fieldInFocus === 'value' &&
										target.selectionStart ===
											target.selectionEnd &&
										target.selectionStart === 0
									) {
										setFieldInFocus( 'label' );
									}
								} }
							/>
						)
					) }
					<Button
						className="nelio-forms-field__action"
						icon="insert"
						onClick={ () =>
							setAttributes( {
								options: [
									...options,
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
						{ _x( 'Add option', 'command', 'nelio-forms' ) }
					</Button>
					<Button
						className="nelio-forms-field__action"
						icon="plus-alt"
						onClick={ () =>
							setAttributes( {
								options: [
									...options,
									{
										label: '',
										disabled: false,
										options: [
											{
												label: '',
												value: '',
												selected: false,
												disabled: false,
											},
										],
									} as OptionGroup,
								],
							} )
						}
					>
						{ _x(
							'Add group of options',
							'command',
							'nelio-forms'
						) }
					</Button>
					<DropdownMenu
						icon="category"
						label={ _x(
							'Add preset options',
							'command',
							'nelio-forms'
						) }
						controls={ presetControls }
						{ ...{
							toggleProps: {
								children: _x(
									'Add preset options',
									'command',
									'nelio-forms'
								),
							},
						} }
					/>
					<Button
						className="nelio-forms-field__action"
						icon="undo"
						onClick={ () =>
							setAttributes( {
								options: [
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
						{ _x( 'Reset options', 'command', 'nelio-forms' ) }
					</Button>
				</div>
			</BaseControl>
		</div>
	);
};

// =======
// HELPERS
// =======

const hasSelected = ( option: OptionItem | OptionGroup ): boolean =>
	isOptionGroup( option )
		? !! option.options.find( ( io ) => io.selected )
		: option.selected;

const deselect = (
	option: OptionItem | OptionGroup
): OptionItem | OptionGroup =>
	isOptionGroup( option )
		? {
				...option,
				options: option.options.map( ( io ) => ( {
					...io,
					selected: false,
				} ) ),
		  }
		: { ...option, selected: false };

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

const CONTAINER = css( {
	marginTop: '0.5em',
	border: '1px solid #757575',
	padding: '0.5em',
	marginBottom: '0.5em',
} );

const LIST = css( {
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
