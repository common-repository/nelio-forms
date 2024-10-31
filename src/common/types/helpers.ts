/**
 * WordPress dependencies
 */
import type { BlockInstance } from '@wordpress/blocks';

export type AttrSetter< T > = readonly [ T, ( val: T ) => void ];

export type FormEditorSettings = {
	readonly addParentLimit: boolean;
	readonly allowedBlocks: ReadonlyArray< string >;
	readonly activePlugins: ReadonlyArray< string >;
	readonly postStatuses: Record< string, ReadonlyArray< PostStatus > >;
	readonly userRoles: Record< string, UserRole >;
	readonly siteUrl: string;
};

type PostStatus = {
	readonly name: string;
	readonly label: string;
};

type UserRole = {
	readonly name: string;
};

export type FormPattern = {
	readonly name: string;
	readonly title: string;
	readonly description: string;
	readonly content: string;
	readonly viewportWidth: number;
	readonly blocks: ReadonlyArray< BlockInstance >;
};
