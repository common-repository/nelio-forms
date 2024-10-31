/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { BlockEditProps } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import { getFormEditorSettings } from '@nelio/forms/utils';

addFilter(
	'editor.BlockEdit',
	'nelio-forms/setAllowedBlocks',
	createHigherOrderComponent(
		( WrappedElement ) => ( props ) => {
			if (
				! isBlockEditElement( WrappedElement ) ||
				! areBlockEditProps( props )
			) {
				return <WrappedElement { ...props } />;
			} //end if

			if ( props.name !== 'core/column' ) {
				return <WrappedElement { ...props } />;
			} //end if

			if ( ! isInForm( props.clientId ) ) {
				return <WrappedElement { ...props } />;
			} //end if

			const { allowedBlocks } = getFormEditorSettings();

			return (
				<WrappedElement
					{ ...{
						...props,
						attributes: {
							...props.attributes,
							allowedBlocks,
						},
					} }
				/>
			);
		},
		'withAllowedBlocks'
	)
);

type BE = ( props: BEP ) => JSX.Element;
type BEP = BlockEditProps< Record< string, unknown > >;

const isBlockEditElement = ( el: unknown ): el is BE => !! el;
const areBlockEditProps = ( props: unknown ): props is BEP => !! props;

const isInForm = ( clientId: string ): boolean =>
	select( 'core/editor' ).getEditedPostAttribute( 'type' ) === 'nelio_form' ||
	! isEmpty(
		select( 'core/block-editor' ).getBlockParentsByBlockName(
			clientId,
			'nelio-forms/form',
			true
		)
	);
