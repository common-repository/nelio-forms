/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject, kebabCase } from 'lodash';
import { FormEditorSettings } from '@nelio/forms/types';

export const fixBlockSettings = (
	props: Record< string, unknown >
): Record< string, unknown > => maybeLimitParent( props );

export const modifiers =
	( mods: Record< string, boolean > ) =>
	( className: string ): string =>
		classnames(
			className,
			Object.keys( mods ).reduce(
				( r, m ) => ( {
					...r,
					[ `${ className }--${ kebabCase( m ) }` ]: mods[ m ],
				} ),
				{}
			)
		);

export const stripTags = ( text: string ): string =>
	text.replace( /<\/?[a-z][^>]*?>/gi, '' );

export function hasOwnProperty< Y extends PropertyKey >(
	obj: unknown,
	prop: Y
): obj is Record< Y, unknown > {
	return !! obj && typeof obj === 'object' && obj.hasOwnProperty( prop );
} //end hasOwnProperty()

export function getFormEditorSettings(): FormEditorSettings {
	const settings = hasFormEditorSettings( window )
		? window.NelioFormsSettings
		: {};

	return {
		addParentLimit: false,
		allowedBlocks: [],
		activePlugins: [],
		postStatuses: {},
		userRoles: {},
		siteUrl: '',
		...settings,
	};
}

// =======
// HELPERS
// =======

const maybeLimitParent = (
	props: Record< string, unknown >
): Record< string, unknown > =>
	getFormEditorSettings().addParentLimit
		? { ...props, parent: [ 'nelio-forms/form' ] }
		: props;

const hasFormEditorSettings = (
	x: unknown
): x is { NelioFormsSettings: Partial< FormEditorSettings > } =>
	hasOwnProperty( x, 'NelioFormsSettings' ) &&
	isObject( x.NelioFormsSettings );
