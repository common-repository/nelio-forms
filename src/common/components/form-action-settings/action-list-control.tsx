/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { useState } from '@wordpress/element';
import { DropdownMenu } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { v4 as uuid } from 'uuid';
import { css } from '@nelio/forms/css';
import { useActionTypes } from '@nelio/forms/actions';
import { isPremium, makePremiumLabel } from '@nelio/forms/utils';
import type { ActionInstance } from '@nelio/forms/types';

/**
 * Internal dependencies
 */
import { ActionItem } from './action-item';
import { EditActionModal } from './edit-action-modal';

export type ActionListControlProps = {
	readonly formId: number;
	readonly actions: ReadonlyArray< ActionInstance >;
	readonly setActions: ( actions: ReadonlyArray< ActionInstance > ) => void;
};
export const ActionListControl = (
	props: ActionListControlProps
): JSX.Element => {
	const [ editAction, setEditAction ] = useState< ActionInstance >();
	const { formId, actions, setActions } = props;
	const isDeleteActive = actions.length > 1;

	const duplicate = ( a: ActionInstance ): ActionInstance => ( {
		...a,
		id: uuid(),
		name: `(${ _x( 'copy', 'text', 'nelio-forms' ) }) ${ a.name }`.trim(),
	} );

	return (
		<>
			<div className={ ACTION_LIST }>
				{ actions.map( ( action, index ) => (
					<ActionItem
						key={ index }
						action={ action }
						isDeleteActive={ isDeleteActive }
						onToggle={ () =>
							setActions(
								[ ...actions ].map( ( a ) =>
									a.id === action.id
										? {
												...action,
												isActive: ! action.isActive,
										  }
										: a
								)
							)
						}
						onEdit={ () => setEditAction( action ) }
						onDuplicate={ () =>
							setActions( [
								...actions.slice( 0, index + 1 ),
								duplicate( action ),
								...actions.slice( index + 1 ),
							] )
						}
						onRemove={ () =>
							setActions(
								[ ...actions ].filter(
									( a ) => a.id !== action.id
								)
							)
						}
					/>
				) ) }
			</div>
			<AddActionControl actions={ actions } onAdd={ setEditAction } />
			{ !! editAction && (
				<EditActionModal
					formId={ formId }
					isNew={ ! actions.includes( editAction ) }
					action={ editAction }
					onClose={ () => setEditAction( undefined ) }
					onSave={ ( newAction ) => {
						if ( actions.includes( editAction ) ) {
							setActions(
								[ ...actions ].map( ( a ) =>
									a.id === newAction.id ? newAction : a
								)
							);
						} else {
							setActions( [ ...actions, newAction ] );
						} //end if
						setEditAction( undefined );
					} }
				/>
			) }
		</>
	);
};

type AddActionControlProps = {
	readonly actions: ReadonlyArray< ActionInstance >;
	readonly onAdd: ( action: ActionInstance ) => void;
};
const AddActionControl = ( props: AddActionControlProps ): JSX.Element => {
	const { actions, onAdd } = props;
	const actionTypes = useActionTypes();
	const controls = actionTypes.map( ( actionType ) => {
		const { label, isPremium: isPremiumAction, icon, type } = actionType;
		const isDisabled =
			actionType.isDisabled ||
			( actionType.isUnique &&
				actions.some( ( a ) => a.type === actionType.type ) );

		return {
			title:
				isPremiumAction && ! isPremium()
					? makePremiumLabel( label )
					: label,
			icon,
			isDisabled,
			onClick: () =>
				! isDisabled &&
				onAdd( {
					type,
					name: label,
					id: uuid(),
					isActive: true,
					attributes: actionType.defaults,
				} ),
		} as DropdownMenu.Control;
	} );
	return (
		<DropdownMenu
			className={ ADD_DROPDOWN }
			label={ _x( 'Add Action', 'command', 'nelio-forms' ) }
			icon="plus"
			controls={ controls }
			{ ...{
				toggleProps: {
					isLink: true,
					children: _x( 'Add Action', 'command', 'nelio-forms' ),
				},
			} }
		/>
	);
};

// ======
// STYLES
// ======

const ACTION_LIST = css( {
	display: 'flex',
	flexDirection: 'column',
	gap: '0.5em',
} );

const ADD_DROPDOWN = css( {
	width: '100%',
	marginTop: '1em',
	textAlign: 'center',

	'.components-dropdown-menu__toggle > .dashicon': {
		display: 'none',
	},
} );
