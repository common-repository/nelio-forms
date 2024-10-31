/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { useEffect, useRef, useState } from '@wordpress/element';
import { FormTokenField } from '@wordpress/components';
import { sprintf, _x } from '@wordpress/i18n';
import type { RefObject } from 'react';

/**
 * External dependencies
 */
import { noop, isString, debounce } from 'lodash';
import { css, cx } from '@nelio/forms/css';
import {
	useEntityKind,
	useEntityRecords,
	useEntityRecordSearch,
} from '@nelio/forms/hooks';

import type { Post, SearchQuery, Term } from '@nelio/forms/types';

type Kind = 'postType' | 'taxonomy';
type Item = {
	readonly id: number;
	readonly name: string;
};

export type SelectControlProps = {
	readonly className?: string;
	readonly kind: 'postType' | 'taxonomy';
	readonly name: string;
	readonly label?: string;
	readonly placeholder?: string;
	readonly value: ReadonlyArray< number >;
	readonly onChange: ( value: ReadonlyArray< number > ) => void;
	readonly disabled?: boolean;
	readonly isSingle?: boolean;
};

export const ItemSelectControl = ( {
	className,
	kind,
	name,
	label,
	placeholder,
	value,
	disabled,
	isSingle,
	onChange,
}: SelectControlProps ): JSX.Element => {
	const [ autoExpand, setAutoExpand ] = useState( false ); // NOTE. Workaround.
	const actualKind = useEntityKind( kind, name );
	const hasSingleValue = isSingle && !! value.length;

	const {
		setQuery,
		items: foundItems,
		loadMoreItems,
	} = useSearchResult( kind, name, { exclude: value } );
	const ref = useRef< HTMLDivElement >( null );
	useEffectOnScrollEnd( ref, loadMoreItems );
	useEffectOnFocusAndBlur( ref, setAutoExpand );

	const onSelectionChange = (
		selection: ReadonlyArray< FormTokenField.Value | string >
	): void => {
		const str = selection.find( isString ) ?? '';
		const item = findByName( str, foundItems );
		onChange(
			[ ...selection, { itemId: item?.id } ]
				.filter( hasItemId )
				.map( ( s ) => s.itemId )
		);
	};

	const currentRecords = useEntityRecords( kind, name, value );
	const selectedItems = [
		...currentRecords.items.map( simplify ),
		...( currentRecords.finished
			? currentRecords.missingItems.map( makeMissingItem )
			: currentRecords.pendingItems.map( makeLoadingItem ) ),
	];

	return (
		<div
			ref={ ref }
			className={ cx(
				CUSTOM_STYLE,
				{
					[ NO_INPUT_STYLE ]: hasSingleValue,
				},
				className
			) }
		>
			<FormTokenField
				value={ selectedItems.map( itemToFormValue ) }
				disabled={ disabled || ! actualKind }
				suggestions={ foundItems.map( ( p ) => p.name ) }
				onInputChange={ setQuery }
				onChange={ onSelectionChange }
				maxLength={ isSingle ? 1 : undefined }
				{ ...{
					label: !! label ? label : '',
					__experimentalShowHowTo: ! isSingle,
					__experimentalExpandOnFocus: autoExpand && ! hasSingleValue,
					placeholder: actualKind
						? placeholder ??
						  _x( 'Search', 'command', 'nelio-forms' )
						: _x( 'Loading…', 'text', 'nelio-forms' ),
				} }
			/>
		</div>
	);
};

// =====
// HOOKS
// =====

const useSearchResult = (
	kind: Kind,
	name: string,
	searchQuery: SearchQuery
): {
	setQuery: ( v: string ) => void;
	items: ReadonlyArray< Item >;
	loadMoreItems?: () => void;
} => {
	const [ items, setItems ] = useState< ReadonlyArray< Item > >( [] );
	const [ query, doSetQuery ] = useState( '' );
	const [ page, setPage ] = useState( 1 );
	const searchResult = useEntityRecordSearch( kind, name, {
		...searchQuery,
		search: query,
		page,
		nelio_forms_search_by_title: true,
	} );

	useEffect( () => {
		if ( ! searchResult.finished ) {
			return;
		} //end if

		const cleanItems = searchResult.items.map( simplify );
		setItems( 1 === page ? cleanItems : [ ...items, ...cleanItems ] );
	}, [
		searchQuery.exclude?.join( ',' ) ?? '',
		searchResult.finished,
		query,
		page,
	] );

	return {
		items: filterByQuery( { ...searchQuery, search: query }, items ),
		loadMoreItems:
			searchResult.finished && searchResult.more
				? () => setPage( page + 1 )
				: undefined,
		setQuery: debounce( doSetQuery, 1000 ),
	};
};

const useEffectOnScrollEnd = (
	ref: RefObject< HTMLDivElement >,
	callback = noop
) =>
	useEffect( () => {
		const onScroll = debounce(
			( ev: UIEvent ) =>
				ev.target &&
				isBottomScroll( ev.target as HTMLElement ) &&
				callback(),
			200
		);
		const opts = { capture: true };
		ref.current?.addEventListener( 'scroll', onScroll, opts );
		return () =>
			ref.current?.removeEventListener( 'scroll', onScroll, opts );
	}, [ callback, ref.current ] );

const useEffectOnFocusAndBlur = (
	ref: RefObject< HTMLDivElement >,
	callback: ( focus: boolean ) => void = noop
) =>
	useEffect( () => {
		const onFocus = () => callback( true );
		const onBlur = () => callback( false );
		const opts = { capture: true };
		ref.current?.addEventListener( 'focus', onFocus, opts );
		ref.current?.addEventListener( 'blur', onBlur, opts );
		return () => {
			ref.current?.removeEventListener( 'focus', onFocus, opts );
			ref.current?.removeEventListener( 'blur', onBlur, opts );
		};
	}, [ callback, ref.current ] );

// =======
// HELPERS
// =======

const makeMissingItem = ( itemId: number ): Item => ( {
	id: itemId,
	/* translators: item id */
	name: sprintf( _x( 'Missing item %d', 'text', 'nelio-forms' ), itemId ),
} );

const makeLoadingItem = ( itemId: number ): Item => ( {
	id: itemId,
	name: sprintf(
		/* translators: an id */
		_x( 'Loading item %d…', 'text', 'nelio-forms' ),
		itemId
	),
} );

const filterByQuery = (
	searchQuery: SearchQuery,
	items: ReadonlyArray< Item >
): ReadonlyArray< Item > => {
	if ( searchQuery.search ) {
		const { search } = searchQuery;
		items = items.filter( ( item ) =>
			item.name.toLowerCase().includes( search.toLowerCase() )
		);
	} //end if

	if ( searchQuery.exclude ) {
		const { exclude } = searchQuery;
		items = items.filter( ( { id } ) => ! exclude.includes( id ) );
	} //end if

	return items;
};

const findByName = (
	name: string,
	items: ReadonlyArray< Item >
): Item | undefined =>
	items.find( ( item ) => item.name.toLowerCase() === name.toLowerCase() );

const itemToFormValue = ( item: Item ): FormTokenField.Value =>
	( {
		itemId: item.id,
		value: item.name,
		title: item.name,
	} as FormTokenField.Value );

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
const hasItemId = ( p: any ): p is { itemId: number } => !! p.itemId;

const getName = ( item: Post | Term ): string => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
	const hasName = ( i: any ): i is { name: string } => !! i.name;
	return hasName( item ) ? item.name : item.title.raw;
};

const simplify = ( item: Post | Term ): Item => ( {
	id: item.id,
	name: sprintf(
		'%1$s (%2$d)',
		getName( item ).replace( /,/g, '' ),
		item.id
	),
} );

const isBottomScroll = ( el: HTMLElement ): boolean =>
	el.scrollHeight - el.scrollTop === el.clientHeight;

// ======
// STYLES
// ======

const CUSTOM_STYLE = css( {
	'& .components-form-token-field__input-container': {
		background: '#fff',
	},

	'& .components-form-token-field__help, & .components-form-token-field__label': {
		display: 'none',
	},

	'& ul.components-form-token-field__suggestions-list': {
		margin: '0',
		padding: '0',
	},
} );

const NO_INPUT_STYLE = css( {
	'& input[type="text"].components-form-token-field__input': {
		height: '0!important',
		minHeight: '0!important',
		minWidth: '0!important',
		opacity: '0',
		width: '0!important',
	},
} );
