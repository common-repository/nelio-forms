/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { Disabled } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './editor.scss';

export type BlockContentOverlayProps = {
	readonly form?: number;
	readonly clientId: string;
	readonly wrapperProps: Record< string, unknown > & MandatoryWrapperProps;
	readonly className: string;
};

type MandatoryWrapperProps = {
	readonly className: string;
	readonly children: JSX.ElementChildrenAttribute;
};

export function BlockContentOverlay( {
	form,
	clientId,
	wrapperProps,
	className,
}: BlockContentOverlayProps ): JSX.Element {
	const baseClassName = 'block-editor-block-content-overlay';
	const [ isOverlayActive, setIsOverlayActive ] = useState( true );
	const [ isHovered, setIsHovered ] = useState( false );

	const {
		canEdit,
		isParentSelected,
		hasChildSelected,
		isDraggingBlocks,
		isParentHighlighted,
	} = useSelect(
		( select ) => {
			const {
				isBlockSelected,
				hasSelectedInnerBlock,
				isDraggingBlocks: _isDraggingBlocks,
				isBlockHighlighted,
			} = select( 'core/block-editor' );
			const { canUser } = select( 'core' );
			return {
				canEdit: !! form && canUser( 'update', 'nelio_form', form ),
				isParentSelected: isBlockSelected( clientId ),
				hasChildSelected: hasSelectedInnerBlock( clientId, true ),
				isDraggingBlocks: _isDraggingBlocks(),
				isParentHighlighted: isBlockHighlighted( clientId ),
			};
		},
		[ clientId ]
	);

	const classes = classnames(
		baseClassName,
		wrapperProps.className,
		className,
		{
			'overlay-active': isOverlayActive,
			'parent-highlighted': isParentHighlighted,
			'is-dragging-blocks': isDraggingBlocks,
		}
	);

	useEffect( () => {
		// The overlay is always active when editing is locked.
		if ( ! canEdit ) {
			setIsOverlayActive( true );
			return;
		}

		// Reenable when blocks are not in use.
		if ( ! isParentSelected && ! hasChildSelected && ! isOverlayActive ) {
			setIsOverlayActive( true );
		}
		// Disable if parent selected by another means (such as list view).
		// We check hover to ensure the overlay click interaction is not taking place.
		// Trying to click the overlay will select the parent block via its 'focusin'
		// listener on the wrapper, so if the block is selected while hovered we will
		// let the mouseup disable the overlay instead.
		if ( isParentSelected && ! isHovered && isOverlayActive ) {
			setIsOverlayActive( false );
		}
		// Ensure overlay is disabled if a child block is selected.
		if ( hasChildSelected && isOverlayActive ) {
			setIsOverlayActive( false );
		}
	}, [
		isParentSelected,
		hasChildSelected,
		isOverlayActive,
		isHovered,
		canEdit,
	] );

	// Disabled because the overlay div doesn't actually have a role or functionality
	// as far as the a11y is concerned. We're just catching the first click so that
	// the block can be selected without interacting with its contents.
	/* eslint-disable jsx-a11y/no-static-element-interactions */
	return (
		<div
			{ ...wrapperProps }
			className={ classes }
			onMouseEnter={ () => setIsHovered( true ) }
			onMouseLeave={ () => setIsHovered( false ) }
			onMouseUp={
				isOverlayActive && canEdit
					? () => setIsOverlayActive( false )
					: undefined
			}
		>
			{ canEdit ? (
				wrapperProps.children
			) : (
				<Disabled>
					<>{ wrapperProps.children }</>
				</Disabled>
			) }
		</div>
	);
}
/* eslint-enable jsx-a11y/no-static-element-interactions */

// =================
// MISSING TYPE DEFS
// =================

declare module '@wordpress/block-editor/store/selectors' {
	/* eslint-disable no-shadow, @typescript-eslint/ban-types */
	export function isBlockHighlighted( clientId: string ): boolean;
	export function isDraggingBlocks(): boolean;
	/* eslint-enable no-shadow, @typescript-eslint/ban-types */
} //end module declaration
