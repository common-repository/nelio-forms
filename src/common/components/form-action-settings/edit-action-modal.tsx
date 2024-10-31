/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { Button, Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isEqual } from 'lodash';
import { css } from '@nelio/forms/css';
import { useActionType } from '@nelio/forms/actions';
import type { ActionInstance } from '@nelio/forms/types';

type EditActionModalProps< T > = {
	readonly formId: number;
	readonly isNew: boolean;
	readonly action: ActionInstance< T >;
	readonly onClose: () => void;
	readonly onSave: ( action: ActionInstance< T > ) => void;
};

export function EditActionModal< T >( {
	formId,
	action,
	isNew,
	onClose,
	onSave,
}: EditActionModalProps< T > ): JSX.Element | null {
	const [ editAction, setEditAction ] = useState( action );

	const actionType = useActionType( action.type );
	const EditComponent = actionType?.edit;

	const isDirty = ! isEqual( action, editAction );

	if ( ! EditComponent ) {
		return null;
	} //end if

	return (
		<Modal
			className={ MODAL }
			title={
				isNew
					? _x( 'New action', 'text', 'nelio-forms' )
					: _x( 'Edit action', 'text', 'nelio-forms' )
			}
			shouldCloseOnClickOutside={ false }
			onRequestClose={ onClose }
		>
			<EditComponent
				{ ...{
					...editAction,
					formId,
					setName: ( name ) =>
						setEditAction( { ...editAction, name } ),
					setAttributes: ( attributes ) =>
						setEditAction( {
							...editAction,
							attributes: {
								...editAction.attributes,
								...attributes,
							},
						} ),
				} }
			/>
			<div className={ EDIT_ACTIONS }>
				<Button isSecondary onClick={ onClose }>
					{ isDirty && ! isNew
						? _x( 'Discard Changes', 'command', 'nelio-forms' )
						: _x( 'Close', 'command', 'nelio-forms' ) }
				</Button>
				<Button
					isPrimary
					disabled={ ! isNew && ! isDirty }
					onClick={ () => onSave( editAction ) }
				>
					{ isNew
						? _x( 'Add', 'command', 'nelio-forms' )
						: _x( 'Update', 'command', 'nelio-forms' ) }
				</Button>
			</div>
		</Modal>
	);
}

// ======
// STYLES
// ======

const MODAL = css( {
	maxWidth: '35em',
} );

const EDIT_ACTIONS = css( {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'flex-end',
	gap: '1em',
} );
