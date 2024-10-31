/**
 * WordPress dependencies
 */
import { serialize } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { DEFAULT_FORM_CONTENT } from './defaults';
import type { Form } from './types';

export const useRefStatus = (
	clientId: string,
	ref?: number
): {
	readonly hasResolved: boolean;
	readonly isMissing: boolean;
} =>
	useSelect(
		( select ) => {
			const persistedBlockFull = select( coreStore ).getEntityRecord(
				'postType',
				'nelio_form',
				ref
			);
			const persistedBlockReadOnly = select( coreStore ).getEntityRecord(
				'postType',
				'nelio_form',
				ref,
				{
					context: 'view',
				}
			);
			const hasResolvedBlock =
				!! select( coreStore ).hasFinishedResolution(
					'getEntityRecord',
					[ 'postType', 'nelio_form', ref ]
				) &&
				!! select( coreStore ).hasFinishedResolution(
					'getEntityRecord',
					[ 'postType', 'nelio_form', ref, { context: 'view' } ]
				);
			return {
				hasResolved: hasResolvedBlock,
				isMissing:
					hasResolvedBlock &&
					! persistedBlockFull &&
					! persistedBlockReadOnly,
			};
		},
		[ ref, clientId ]
	);

export const useRenderedFormContent = ( ref: number ): string =>
	useSelect(
		( select ) => {
			const persistedBlockReadOnly = select( coreStore ).getEntityRecord(
				'postType',
				'nelio_form',
				ref,
				{
					context: 'view',
				}
			);
			return (
				(
					persistedBlockReadOnly as {
						content?: { rendered?: string };
					}
				 ).content?.rendered ?? ''
			);
		},
		[ ref ]
	);

export const useForms = (): {
	readonly forms: ReadonlyArray< Form >;
	readonly hasResolved: boolean;
} =>
	useSelect( ( select ) => {
		const forms: ReadonlyArray< Record< string, unknown > > =
			select( coreStore ).getEntityRecords( 'postType', 'nelio_form' ) ??
			[];
		const hasResolvedForms = !! select( coreStore ).hasFinishedResolution(
			'getEntityRecords',
			[ 'postType', 'nelio_form' ]
		);
		return {
			hasResolved: hasResolvedForms,
			forms: forms.filter( isForm ),
		};
	} );

const isForm = ( f: Partial< Form > ): f is Form =>
	!! f && !! f.id && !! f.slug && !! f.type && !! f.title?.raw;

export const useCreateForm = (
	title: string,
	setRef: ( number ) => void
): ( () => void ) => {
	const { saveEntityRecord } = useDispatch( coreStore );

	const form = {
		title,
		content: serialize( DEFAULT_FORM_CONTENT ),
		status: 'publish',
	};

	return useCallback( async () => {
		// eslint-disable-next-line @typescript-eslint/await-thenable
		const updatedForm = await saveEntityRecord< Form >(
			'postType',
			'nelio_form',
			form
		);
		setRef( updatedForm.id );
	}, [ title ] );
};

// =================
// MISSING TYPE DEFS
// =================

declare module '@wordpress/core-data' {
	/* eslint-disable no-shadow, @typescript-eslint/ban-types */
	export function useEntityBlockEditor(
		kind: string,
		type: string,
		options: Record< string, unknown >
	): [ ReadonlyArray< unknown >, Function, Function ];
	export function useEntityProp< T >(
		kind: string,
		type: string,
		prop: string,
		id: number
	): [ T, ( v: T ) => void ];
	export const store = 'core/data';
	/* eslint-enable no-shadow, @typescript-eslint/ban-types */
} //end module declaration
