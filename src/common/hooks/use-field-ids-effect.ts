/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import type { BlockInstance } from '@wordpress/blocks';
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import '@nelio/forms/types';

export const useFieldIdsEffect = ( clientId: string ): void => {
	const fieldType = useFieldType( clientId );
	const [ fieldId, isNew ] = useFieldId( clientId, fieldType );

	const formId = useFormId( clientId );
	const htmlId = `nelio-forms-form-${ formId }__${ fieldId }`;

	const { updateBlock, __unstableMarkNextChangeAsNotPersistent } =
		useDispatch( 'core/block-editor' );

	useEffect( () => {
		if ( ! isNew ) {
			return;
		} //end if
		__unstableMarkNextChangeAsNotPersistent?.();
		updateBlock( clientId, {
			attributes: {
				id: fieldId,
				htmlId,
			},
		} );
	}, [ isNew ] );
};

// =====
// HOOKS
// =====

const useFormId = ( clientId: string ): number => {
	const contextId = useSelect( ( select ): number => {
		const { getBlock, getBlockParentsByBlockName } =
			select( 'core/block-editor' );
		const pid = getBlockParentsByBlockName(
			clientId,
			'nelio-forms/form',
			true
		)[ 0 ];
		const parent = pid ? getBlock( pid ) : null;
		return hasRef( parent ) ? parent.attributes.ref : 0;
	} );
	const postId = useSelect( ( select ): number =>
		select( 'core/editor' ).getEditedPostAttribute( 'id' )
	);
	return contextId || postId;
};

const useFieldType = ( clientId: string ): string =>
	useSelect( ( select ) => {
		const block = select( 'core/block-editor' ).getBlock( clientId );
		return hasType( block ) ? block.attributes.type : 'any';
	} );

const useFieldId = (
	clientId: string,
	prefix: string
): [ string, boolean ] => {
	const [ shouldCheckIds, setShouldCheckIds ] = useState( true );
	const block = useSelect( ( select ) =>
		select( 'core/block-editor' ).getBlock( clientId )
	);
	const fieldId = useSelect( ( select ) => {
		const {
			getBlocksByClientId,
			getBlockParentsByBlockName,
			getClientIdsOfDescendants,
			getClientIdsWithDescendants,
		} = select( 'core/block-editor' );

		if ( ! shouldCheckIds && hasFieldId( prefix )( block ) ) {
			return block.attributes.id;
		} //end if

		const ascendants = getBlockParentsByBlockName(
			clientId,
			'nelio-forms/form',
			true
		);

		const descendantIds = ascendants[ 0 ]
			? getClientIdsOfDescendants( [ ascendants[ 0 ] ] )
			: getClientIdsWithDescendants();
		const descendants = getBlocksByClientId( descendantIds );

		if (
			shouldCheckIds &&
			hasFieldId( prefix )( block ) &&
			hasUniqueId( block, descendants )
		) {
			return block.attributes.id;
		} //end if

		const ids = descendants
			.filter( hasFieldId( prefix ) )
			.filter( ( d ) => d !== block )
			.map( extractId );

		return `${ prefix }-${ Math.max( 0, ...ids ) + 1 }`;
	} );

	useEffect( () => setShouldCheckIds( false ) );
	return [ fieldId, fieldId !== block?.attributes.id ];
};

// =======
// HELPERS
// =======

const hasRef = (
	b: BlockInstance | null
): b is BlockInstance< { ref: number } > => !! b && !! b.attributes.ref;

const isFieldId =
	( id: string ) =>
	( b: BlockInstance ): boolean =>
		id === b.attributes.id;

const hasType = (
	b: BlockInstance | null
): b is BlockInstance< { type: string } > =>
	!! b && !! b.attributes && 'string' === typeof b.attributes.type;

const hasFieldId = ( prefix: string ) => {
	const re = new RegExp( `^${ prefix }-\\d\+$` );
	return ( b: BlockInstance | null ): b is BlockInstance< { id: string } > =>
		!! b && re.test( `${ b.attributes.id as string }` );
};

const extractId = ( b: BlockInstance< { id: string } > ): number =>
	parseInt( b.attributes.id.replace( /[^\d]/g, '' ) ) || 0;

const hasUniqueId = (
	block: BlockInstance,
	blocks: ReadonlyArray< BlockInstance | null >
): boolean =>
	! blocks
		.filter( ( b ) => b !== null )
		.filter( ( b ) => b !== block )
		.some( isFieldId( block.attributes.id ) );
