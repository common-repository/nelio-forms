/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import {
	Dropdown,
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Dashicon,
} from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { truncate } from 'lodash';
import { css } from '@nelio/forms/css';
import { useFieldBlocks } from '@nelio/forms/hooks';
import { stripTags } from '@nelio/forms/utils';

export type SmartFieldTagsControl = {
	readonly value: string;
	readonly type?: string;
	readonly onChange: ( value: string ) => void;
};
export const SmartFieldTagsControl = (
	props: SmartFieldTagsControl
): JSX.Element => {
	const { value, onChange, type } = props;
	const fieldBlocks = useFieldBlocks();
	const otherFields = getOtherFields();
	return (
		<DropdownMenu
			className={ TAGS_DROPDOWN }
			icon="tag"
			label={ _x( 'Field tags', 'command', 'nelio-forms' ) }
		>
			{ ( childrenProps ) => (
				<>
					{ createMenuGroup(
						childrenProps,
						_x( 'Form Fields', 'text', 'nelio-forms' ),
						value,
						onChange,
						fieldBlocks,
						type
					) }
					{ createMenuGroup(
						childrenProps,
						_x( 'Other', 'text', 'nelio-forms' ),
						value,
						onChange,
						otherFields,
						type
					) }
				</>
			) }
		</DropdownMenu>
	);
};

type Tag = {
	readonly id: string;
	readonly label: string;
	readonly type: string;
	readonly icon: string;
};

function createMenuGroup(
	{ onClose }: Dropdown.RenderProps,
	groupLabel: string,
	value: string,
	onChange: ( t: string ) => void,
	tags: ReadonlyArray< Tag >,
	type?: string
): JSX.Element | null {
	const validFields = !! type
		? tags.filter( ( f ) => f.type === type )
		: tags;

	if ( validFields.length === 0 ) {
		return null;
	} //end if

	return (
		<MenuGroup label={ groupLabel }>
			{ validFields.map( ( { id, icon, label }, index ) => (
				<MenuItem
					key={ index }
					icon={ icon as Dashicon.Icon }
					onClick={ () => {
						onChange( `${ value }{${ id }}` );
						onClose();
					} }
				>
					{ truncate( stripTags( label ), { length: 40 } ) }
				</MenuItem>
			) ) }
		</MenuGroup>
	);
}

const getOtherFields = () => [
	{
		id: 'all_fields',
		icon: 'editor-table',
		label: _x( 'All Available Fields', 'text', 'nelio-forms' ),
		type: 'text',
	},
	{
		id: 'admin_email',
		icon: 'admin-users',
		label: _x( 'Site Administrator Email', 'text', 'nelio-forms' ),
		type: 'email',
	},
	{
		id: 'form_id',
		icon: 'forms',
		label: _x( 'Form ID', 'text', 'nelio-forms' ),
		type: 'text',
	},
	{
		id: 'form_title',
		icon: 'forms',
		label: _x( 'Form Title', 'text', 'nelio-forms' ),
		type: 'text',
	},
	{
		id: 'home_url',
		icon: 'admin-home',
		label: _x( 'Home URL', 'text', 'nelio-forms' ),
		type: 'url',
	},
];

// ======
// STYLES
// ======

const TAGS_DROPDOWN = css( {
	position: 'absolute',
	right: '0',
	top: '0',

	'.components-button.has-icon': {
		padding: '0',
		minWidth: 'auto',
		height: 'auto',
		color: '#aaa',

		':hover': {
			color: 'var(--wp-admin-theme-color)',
		},

		'.dashicon': {
			margin: '0',
			marginTop: '3px',
			fontSize: '16px',
			width: '1em',
			height: '1em',
		},
	},
} );
