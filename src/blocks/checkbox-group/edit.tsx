/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { useState } from '@wordpress/element';
import { Button, CheckboxControl } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';
import { _x } from '@wordpress/i18n';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { modifiers } from '@nelio/forms/utils';
import { FieldLabel, OptionLabel } from '@nelio/forms/components';
import { useFieldIdsEffect } from '@nelio/forms/hooks';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import BlockToolbar from './toolbar';
import type { Attributes, CheckboxItem } from './types';
import './editor.scss';

const Edit = ( props: BlockEditProps< Attributes > ): JSX.Element => {
	const { attributes, className, clientId, isSelected, setAttributes } =
		props;
	const { label, options, disabled, required } = attributes;
	const [ inFocus, setInFocus ] = useState< number | null >( null );

	useFieldIdsEffect( clientId );

	const applyModifiers = modifiers( {
		'checkbox-group': true,
		required,
		disabled,
	} );

	const blockProps = useBlockProps( {
		className: classnames(
			className,
			applyModifiers( 'nelio-forms-field' )
		),
	} );

	const onCheckboxChange = ( value: boolean, index: number ) =>
		setAttributes( {
			options: options.map( ( o, i ) =>
				i === index ? { ...o, checked: value } : o
			),
		} );

	const onOptionLabelChange = ( value: string, index: number ) =>
		setAttributes( {
			options: options.map( ( o, i ) =>
				i === index ? { ...o, label: value } : o
			),
		} );

	const onEnterPressed = ( target: HTMLInputElement, index: number ) => {
		setAttributes( {
			options: options.reduce(
				( acc, o, i ) =>
					i === index
						? [
								...acc,
								...splitLabel(
									o.label,
									o.checked,
									target.selectionStart,
									target.selectionEnd
								),
						  ]
						: [ ...acc, o ],
				[]
			),
		} );
		setInFocus( index + 1 );
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
			key === 'Delete' && end === options[ index ].label.length;

		if ( index === 0 ) {
			if ( ! isDeleteJoin || options.length < 2 ) {
				return false;
			} //end if

			const [ c, n, ...r ] = options;
			setAttributes( { options: [ joinLabel( c, n ), ...r ] } );
			return true;
		} //end if

		if ( index === options.length - 1 ) {
			if ( ! isBackspaceJoin || options.length < 2 ) {
				return false;
			} //end if

			const [ l, p, ...r ] = [ ...options ].reverse();
			setAttributes( { options: [ joinLabel( p, l ), ...r ].reverse() } );
			setInFocus( index - 1 );
			return true;
		} //end if

		if ( isBackspaceJoin ) {
			const f = options.slice( 0, index - 1 );
			const p = options[ index - 1 ];
			const c = options[ index ];
			const r = options.slice( index + 1 );
			setAttributes( { options: [ ...f, joinLabel( p, c ), ...r ] } );
			setInFocus( index - 1 );
			return true;
		} //end if

		if ( isDeleteJoin ) {
			const f = options.slice( 0, index );
			const c = options[ index ];
			const n = options[ index + 1 ];
			const r = options.slice( index + 2 );
			setAttributes( { options: [ ...f, joinLabel( c, n ), ...r ] } );
			return true;
		} //end if

		return false;
	};

	return (
		<>
			{ isSelected && <Inspector { ...props } /> }
			{ isSelected && <BlockToolbar { ...props } /> }
			<div { ...blockProps }>
				<FieldLabel
					className={ applyModifiers( 'nelio-forms-field__label' ) }
					label={ label }
					isSelected={ isSelected }
					isHidden={ false }
					onChange={ ( value ) => setAttributes( { label: value } ) }
				/>
				<div className={ applyModifiers( 'nelio-forms-field__value' ) }>
					{ options.map( ( option, index ) => (
						<div
							key={ index }
							className={ applyModifiers(
								'nelio-forms-field__item'
							) }
						>
							<div
								className={ applyModifiers(
									'nelio-forms-field__item-value'
								) }
							>
								<CheckboxControl
									checked={ option.checked }
									autoComplete="off"
									disabled={ disabled }
									onChange={ ( value ) =>
										onCheckboxChange( value, index )
									}
								/>
							</div>
							<OptionLabel
								className={ applyModifiers(
									'nelio-forms-field__item-label'
								) }
								label={ option.label }
								isInFocus={ isSelected && inFocus === index }
								onFocus={ () => setInFocus( index ) }
								onChange={ ( value ) =>
									onOptionLabelChange( value, index )
								}
								onKeyDown={ ( event ) => {
									const { key } = event;
									const target =
										event.target as HTMLInputElement;
									if ( 'Enter' === key ) {
										onEnterPressed( target, index );
									} //end if

									if (
										'Backspace' === key ||
										'Delete' === key
									) {
										if (
											onRemovePressed(
												key,
												target,
												index
											)
										) {
											event.preventDefault();
										} //end if
									} //end if

									if ( 'ArrowDown' === key ) {
										setInFocus(
											Math.min(
												options.length,
												index + 1
											)
										);
									} //end if

									if ( 'ArrowUp' === key ) {
										setInFocus( Math.max( 0, index - 1 ) );
									} //end if
								} }
							/>
							{ options.length > 1 && (
								<Button
									className="nelio-forms-field__item-action"
									icon="trash"
									label={ _x(
										'Remove option',
										'command',
										'nelio-forms'
									) }
									showTooltip={ true }
									onClick={ () =>
										setAttributes( {
											options: options.filter(
												( _, i ) => i !== index
											),
										} )
									}
								/>
							) }
						</div>
					) ) }
				</div>
				<Button
					className="nelio-forms-field__action"
					icon="insert"
					onClick={ () =>
						setAttributes( {
							options: [
								...options,
								{ checked: false, label: '' },
							],
						} )
					}
				>
					{ _x( 'Add option', 'command', 'nelio-forms' ) }
				</Button>
			</div>
		</>
	);
};

export default Edit;

// =======
// HELPERS
// =======

const splitLabel = (
	label: string,
	checked: boolean,
	start: number | null,
	end: number | null
) => {
	return [
		{
			checked,
			label: start !== null ? label.substring( 0, start ) : label,
		},
		{
			checked,
			label: end !== null ? label.substring( end ) : '',
		},
	];
};

const joinLabel = ( o1: CheckboxItem, o2: CheckboxItem ): CheckboxItem => {
	if ( ! o2 ) {
		return { ...o1 };
	} //end if

	return {
		label: o1.label + o2.label,
		checked: o1.checked || o2.checked,
	};
};
