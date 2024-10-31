/**
 * External dependencies
 */
import { ComponentType } from 'react';

/**
 * Internal dependencies
 */
import type { AttrSetter } from './helpers';

declare module '@wordpress/core-data' {
	export function useEntityProp< T >(
		context: 'postType',
		type: string,
		attr: string
	): AttrSetter< T >;
} //end module declaration

declare module '@wordpress/core-data/selectors' {
	export function getEditedEntityRecord(
		kind: string,
		name: string,
		recordId: number
	): Record< string, unknown >;
	export function getPostTypes(
		q?: SearchQuery
	): null | ReadonlyArray< PostType >;
	export function getTaxonomies(
		q?: SearchQuery
	): null | ReadonlyArray< Taxonomy >;
	export function hasFinishedResolution(
		selector: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		args: any[]
	): boolean;
} //end module declaration

declare module '@wordpress/core-data/actions' {
	export function editEntityRecord(
		kind: string,
		name: string,
		recordId: number,
		edits: Record< string, unknown >,
		options: Record< string, unknown >
	): void;
} //end module declaration

declare module '@wordpress/block-editor/components' {
	type BlockPreviewProps = {
		readonly viewportWidth: number;
		readonly blocks: ReadonlyArray< unknown >;
	};
	export const BlockPreview: ComponentType< BlockPreviewProps >;
} //end module declaration

declare module '@wordpress/block-editor/store/actions' {
	export function __unstableMarkNextChangeAsNotPersistent(): void;
} //end module declaration

declare module '@wordpress/block-editor/store/selectors' {
	export function getBlockParentsByBlockName(
		clientId: string,
		blockName: string | string[],
		ascending: boolean
	): ReadonlyArray< string >;
} //end module declaration

declare module '@wordpress/blocks' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	export interface BlockEditProps< T extends Record< string, any > >
		extends BlockSaveProps< T > {
		readonly name: string;
	}
	/* eslint-disable no-shadow, @typescript-eslint/ban-types */
	export function registerBlockVariation(
		type: string,
		options: WPBlockVariation
	): void;
	export function getBlockVariations(
		blockName: string | string[]
	): ReadonlyArray< WPBlockVariation >;
	/* eslint-enable no-shadow, @typescript-eslint/ban-types */
} //end module declaration

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WPBlockVariation< T extends Record< string, unknown > = any > = {
	readonly name: string;
	readonly title: string;
	readonly description?: string;
	readonly category?: string;
	readonly icon?: string;
	readonly keywords?: string[];
	readonly attributes?: Partial< T >;
	readonly scope?: ReadonlyArray< WPBlockVariationScope >;
	readonly isActive?:
		| ReadonlyArray< keyof T >
		| ( ( blockAttrs: T, varAttrs: T ) => boolean );
};

export type WPBlockVariationScope = 'block' | 'inserter' | 'transform';

export type Author = {
	readonly id: number;
	readonly name: string;
};

export type PostType = {
	readonly name: string;
	readonly slug: string;
	// eslint-disable-next-line camelcase
	readonly rest_base: string;
	readonly viewable: boolean;
	readonly labels: PostTypeLabels;
};

export type PostTypeLabels = {
	// eslint-disable-next-line camelcase
	readonly all_items: string;
	// eslint-disable-next-line camelcase
	readonly search_items: string;
	// eslint-disable-next-line camelcase
	readonly singular_name?: string;
};

export type Post = {
	readonly id: number;
	readonly slug: string;
	readonly type: string;
	readonly title: {
		readonly raw: string;
	};
};

export type Taxonomy = {
	readonly name: string;
	readonly slug: string;
	readonly types: string[];
	readonly labels: TaxonomyLabels;
	readonly visibility: TaxonomyVisibility;
};

export type TaxonomyLabels = {
	readonly name: string;
	// eslint-disable-next-line camelcase
	readonly all_items: string;
	// eslint-disable-next-line camelcase
	readonly search_items: string;
};

export type TaxonomyVisibility = {
	readonly public: boolean;
};

export type Term = {
	readonly id: number;
	readonly slug: string;
	readonly name: string;
};

export type SelectResult< T > =
	| {
			readonly finished: false;
			readonly items: ReadonlyArray< T >;
			readonly pendingItems: ReadonlyArray< number >;
	  }
	| {
			readonly finished: true;
			readonly items: ReadonlyArray< T >;
			readonly missingItems: ReadonlyArray< number >;
	  };

export type SearchQuery = {
	readonly search?: string;
	readonly exclude?: ReadonlyArray< number >;
	readonly page?: number;
	// eslint-disable-next-line camelcase
	readonly per_page?: number;
	// eslint-disable-next-line camelcase
	readonly nelio_forms_search_by_title?: boolean;
};

export type QueryResult< T > =
	| {
			readonly finished: false;
	  }
	| {
			readonly finished: true;
			readonly items: ReadonlyArray< T >;
			readonly more: boolean;
	  };
