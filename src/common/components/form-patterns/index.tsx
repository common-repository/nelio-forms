/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { cloneBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import { _x, sprintf } from '@wordpress/i18n';
import type { BlockInstance } from '@wordpress/blocks';

/**
 * External dependencies
 */
import { map } from 'lodash';
import { getFormPatterns } from '@nelio/forms/utils';
import type { FormPattern } from '@nelio/forms/types';

/**
 * Internal dependencies
 */
import BlockPatternList from './block-pattern-list';

type FormPatternsProps = {
	readonly clientId?: string;
};
export const FormPatterns = ( {
	clientId,
}: FormPatternsProps ): JSX.Element => {
	const { createSuccessNotice } = useDispatch( 'core/notices' );
	const { replaceBlocks } = useDispatch( 'core/block-editor' );

	const clientIds = useSelect( ( select ) =>
		clientId
			? select( 'core/block-editor' ).getClientIdsOfDescendants( [
					clientId,
			  ] )
			: map(
					select( 'core/block-editor' ).getBlocks(),
					( block ) => block.clientId
			  )
	);

	const onClickPattern = (
		pattern: FormPattern,
		blocks: ReadonlyArray< BlockInstance >
	) => {
		replaceBlocks(
			clientIds,
			map( blocks, ( block ) => cloneBlock( block ) )
		);
		createSuccessNotice(
			sprintf(
				/* translators: %s: block pattern title. */
				_x( 'Form pattern "%s" inserted.', 'text', 'nelio-forms' ),
				pattern.title
			),
			{ type: 'snackbar' }
		);
	};

	return (
		<BlockPatternList
			blockPatterns={ getFormPatterns() }
			onClickPattern={ onClickPattern }
		/>
	);
};
