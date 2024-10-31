/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { DropdownMenu, ToggleControl } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { css, cx } from '@nelio/forms/css';
import { useActionType } from '@nelio/forms/actions';
import type { ActionInstance } from '@nelio/forms/types';

export type ActionItemProps< T > = {
	readonly action: ActionInstance< T >;
	readonly isDeleteActive: boolean;
	readonly onToggle: () => void;
	readonly onEdit: () => void;
	readonly onDuplicate: () => void;
	readonly onRemove: () => void;
};

export function ActionItem< T >( {
	action,
	isDeleteActive,
	onToggle,
	onEdit,
	onDuplicate,
	onRemove,
}: ActionItemProps< T > ): JSX.Element {
	const actionType = useActionType( action.type );

	return (
		<div className={ ACTION_WRAPPER }>
			<div className={ ACTIVE_CONTROL }>
				<ToggleControl
					checked={ action.isActive }
					onChange={ onToggle }
					{ ...{ disabled: actionType?.isDisabled } }
				/>
			</div>
			<div className={ DESCRIPTION_WRAPPER }>
				<p className={ NAME }>{ action.name }</p>
				<p className={ LABEL }>{ actionType?.label }</p>
			</div>
			<DropdownMenu
				className={ ACTIONS }
				icon="admin-generic"
				label={ _x( 'Settings', 'command', 'nelio-forms' ) }
				controls={ [
					{
						title: _x( 'Edit action', 'command', 'nelio-forms' ),
						icon: 'edit',
						isDisabled: actionType?.isDisabled,
						onClick: onEdit,
					},
					{
						title: _x( 'Remove action', 'command', 'nelio-forms' ),
						icon: 'trash',
						isDisabled: ! isDeleteActive || actionType?.isDisabled,
						onClick: onRemove,
					},
					{
						title: _x(
							'Duplicate action',
							'command',
							'nelio-forms'
						),
						icon: 'admin-page',
						isDisabled: actionType?.isDisabled,
						onClick: onDuplicate,
					},
				] }
			/>
		</div>
	);
}

// ======
// STYLES
// ======

const ACTION_WRAPPER = css( {
	display: 'flex',
	flexDirection: 'row',
} );

const ACTIVE_CONTROL = css( {
	flexGrow: '0',
} );

const DESCRIPTION_WRAPPER = css( {
	flexGrow: '1',
	display: 'flex',
	flexDirection: 'column',
	minWidth: '0',
} );

const NAME = css( {
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	marginBottom: '0',
} );

const LABEL = cx(
	NAME,
	css( {
		color: '#aaa',
		fontStyle: 'italic',
	} )
);

const ACTIONS = css( {
	flexGrow: '0',

	'.components-dropdown-menu__toggle': {
		padding: '0 !important',
		minWidth: 'auto !important',
		height: 'auto',
		width: 'auto',
	},
} );
