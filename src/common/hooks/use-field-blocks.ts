/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { getBlockType, getBlockVariations } from '@wordpress/blocks';
import type { BlockInstance } from '@wordpress/blocks';

/**
 * External dependencies
 */
import { isFunction, isEqual, pick, isObject, isString, has } from 'lodash';

export type FieldBlock = {
	readonly id: string;
	readonly label: string;
	readonly name: string;
	readonly type: string;
	readonly icon: string;
};

export const useFieldBlocks = (
	clientId?: string
): ReadonlyArray< FieldBlock > => {
	return useSelect( ( select ) => {
		const {
			getBlocksByClientId,
			getClientIdsOfDescendants,
			getClientIdsWithDescendants,
		} = select( 'core/block-editor' );

		const clientIds = clientId
			? getClientIdsOfDescendants( [ clientId ] )
			: getClientIdsWithDescendants();
		const blocks = getBlocksByClientId( clientIds );

		const fieldBlocks = blocks
			.filter( isFieldBlock )
			.map( extractFieldBlockData );

		return fieldBlocks;
	} );
};

const isFieldBlock = ( b: BlockInstance ): boolean =>
	b &&
	b.name.startsWith( 'nelio-forms/' ) &&
	b.name !== 'nelio-forms/form' &&
	! b.attributes.disabled;

const extractFieldBlockData = (
	b: BlockInstance< FieldBlock >
): FieldBlock => ( {
	id: b.attributes.id,
	label: b.attributes.label || b.attributes.id,
	name: getName( b ),
	type: getType( b ),
	icon: getIcon( b ),
} );

const getType = (
	block: BlockInstance< FieldBlock >
): 'text' | 'email' | 'url' => {
	if ( block.attributes.type === 'email' ) {
		return 'email';
	} else if ( block.attributes.type === 'url' ) {
		return 'url';
	} //end if
	return 'text';
};

const getName = ( block: BlockInstance< FieldBlock > ): string =>
	getActiveVariation( block )?.name || block.name;

const getIcon = ( block: BlockInstance< FieldBlock > ): string => {
	const blockType = getBlockType( block.name );
	const activeVariation = getActiveVariation( block );

	return (
		getIconSrc( activeVariation?.icon ) ??
		getIconSrc( blockType?.icon ) ??
		'editor-code'
	);
};

const getIconSrc = ( icon: unknown ): string | undefined => {
	if ( isString( icon ) ) {
		return icon;
	} //end if

	const hasSrc = ( o: unknown ): o is { src: unknown } =>
		isObject( o ) && has( o, 'src' );

	if ( hasSrc( icon ) && isString( icon.src ) ) {
		return icon.src;
	} //end if

	return undefined;
};

const getActiveVariation = ( block: BlockInstance< FieldBlock > ) => {
	const variations = getBlockVariations( block.name ) || [];

	return variations.find( ( v ) => {
		if ( isFunction( v.isActive ) ) {
			return v.isActive( block.attributes, v.attributes );
		} //end if

		const expected = pick( v.attributes, v.isActive || [] );
		const actual = pick( block.attributes, v.isActive || [] );
		return isEqual( expected, actual );
	} );
};
