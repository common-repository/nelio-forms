/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * External dependencies
 */
import { every, filter, find } from 'lodash';

import type {
	Author,
	AttrSetter,
	Post,
	PostType,
	QueryResult,
	SearchQuery,
	SelectResult,
	Taxonomy,
	Term,
} from '@nelio/forms/types';

export function usePostMeta< A >(
	name: string,
	recordId?: number
): AttrSetter< A > {
	const meta = useSelect( ( select ) =>
		!! recordId
			? select( 'core' ).getEditedEntityRecord(
					'postType',
					'nelio_form',
					recordId
			  )[ name ]
			: select( 'core/editor' ).getEditedPostAttribute( name )
	);
	const { editEntityRecord } = useDispatch( 'core' );
	const { editPost } = useDispatch( 'core/editor' );
	return [
		meta as A,
		( value: A ): void => {
			const edits = { [ name ]: value };
			const options = { undoIgnore: true };
			return !! recordId
				? editEntityRecord(
						'postType',
						'nelio_form',
						recordId,
						edits,
						options
				  )
				: editPost( edits, options );
		},
	] as const;
} //end usePostMeta()

export function useAuthors(): ReadonlyArray< Author > {
	return useSelect( ( select ) => select( 'core' ).getAuthors() ) || [];
} //end usePostTypes()

export function usePostTypes(): ReadonlyArray< PostType > {
	const postTypes = useAllPostTypes();
	return filter( postTypes, ( p ) => p.viewable && 'nelio_form' !== p.slug );
} //end usePostTypes()

export function useAllowedPostTypes(): ReadonlyArray< PostType > {
	const postTypes = useAllAllowedPostTypes();
	return filter( postTypes, ( p ) => p.viewable && 'nelio_form' !== p.slug );
} //end usePostTypes()

export function useTaxonomies( postType?: string ): ReadonlyArray< Taxonomy > {
	const taxonomies = useAllTaxonomies();
	return filter(
		taxonomies,
		( t ) => ! postType || t.types.includes( postType )
	);
} //end useTaxonomies()

export function useEntityKind(
	kind: 'postType' | 'taxonomy',
	name: string
): PostType | Taxonomy | undefined {
	const postTypes = useAllPostTypes();
	const taxonomies = useAllTaxonomies();
	const types: ReadonlyArray< PostType | Taxonomy > =
		'postType' === kind ? postTypes : taxonomies;

	return find( types, { slug: name } );
} //end useEntityKind()

export function useEntityRecordSearch(
	kind: 'postType' | 'taxonomy',
	name: string,
	query: SearchQuery
): QueryResult< Post | Term > {
	query = { per_page: 10, ...query };

	const records = useSelect( ( select ) =>
		select( 'core' ).getEntityRecords( kind, name, query )
	);

	const hasFinished = useSelect( ( select ) =>
		select( 'core' ).hasFinishedResolution( 'getEntityRecords', [
			kind,
			name,
			query,
		] )
	);

	if ( ! hasFinished ) {
		return { finished: false };
	} //end if

	const items: ReadonlyArray< Post | Term > =
		'postType' === kind
			? filter( records, isPost )
			: filter( records, isTerm );
	return {
		finished: true,
		items,
		more: query.per_page === items.length,
	};
} //end useEntityRecordSearch()

export function useEntityRecords(
	kind: 'postType' | 'taxonomy',
	name: string,
	itemIds: ReadonlyArray< number >
): SelectResult< Post | Term > {
	const records = useSelect( ( select ) => {
		const { getEntityRecord } = select( 'core' );
		return itemIds.map( ( itemId ) =>
			getEntityRecord( kind, name, itemId )
		);
	} );

	const finishedStatuses = useSelect( ( select ) => {
		const { hasFinishedResolution } = select( 'core' );
		return itemIds.map( ( itemId ) =>
			hasFinishedResolution( 'getEntityRecord', [ kind, name, itemId ] )
		);
	} );

	const hasFinished = every( finishedStatuses );
	const items: ReadonlyArray< Post | Term > =
		'postType' === kind
			? filter( records, isPost )
			: filter( records, isTerm );
	const loadedItemIds = items.map( ( { id } ) => id );
	const pendingItems = itemIds.filter(
		( id ) => ! loadedItemIds.includes( id )
	);
	return ! hasFinished
		? { finished: false, items, pendingItems }
		: { finished: true, items, missingItems: pendingItems };
} // end useEntityRecords()

export const useCanUser = (
	action: 'create' | 'read' | 'update' | 'delete',
	resource: string,
	id: number | string
): { readonly hasResolvedUserCan: boolean; readonly userCan?: boolean } =>
	useSelect( ( select ) => {
		const userCan: boolean | undefined = select( coreStore ).canUser(
			action,
			resource,
			id
		);
		const hasResolvedUserCan = !! select( coreStore ).hasFinishedResolution(
			'canUser',
			[ action, resource, id ]
		);
		return {
			hasResolvedUserCan,
			userCan,
		};
	} );

// =======
// HELPERS
// =======

const useAllPostTypes = (): ReadonlyArray< PostType > =>
	useSelect( ( select ) =>
		select( 'core' ).getPostTypes( { per_page: -1 } )
	) || [];

const useAllAllowedPostTypes = (): ReadonlyArray< PostType > | undefined =>
	useSelect( ( select ) =>
		select( 'core' )
			.getPostTypes( { per_page: -1 } )
			?.filter( ( p ) =>
				select( 'core' ).canUser( 'create', p.rest_base, '' )
			)
	);

const useAllTaxonomies = (): ReadonlyArray< Taxonomy > =>
	filter(
		useSelect( ( select ) =>
			select( 'core' ).getTaxonomies( { per_page: -1 } )
		),
		( t ) => t.visibility.public
	);

const isPost = ( p?: Partial< Post > ): p is Post =>
	!! p && !! p.id && !! p.slug && !! p.type && !! p.title?.raw;

const isTerm = ( t: Partial< Term > ): t is Term =>
	!! t && !! t.id && !! t.slug && !! t.name;
