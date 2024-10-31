/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { cloneBlock } from '@wordpress/blocks';
import { VisuallyHidden } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { _x } from '@wordpress/i18n';
import { BlockPreview } from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';

/**
 * External dependencies
 */
import { map } from 'lodash';
import type { FormPattern } from '@nelio/forms/types';

/**
 * Component adapted from Gutenberg codebase. Use the Gutenberg one instead
 * when it is exported publicly.
 * See https://github.com/WordPress/gutenberg/pull/42148
 */

type BlockPatternType = {
	readonly pattern: FormPattern;
	readonly onClick: (
		pattern: FormPattern,
		blocks: ReadonlyArray< BlockInstance >
	) => void;
};
const BlockPattern = ( {
	pattern,
	onClick,
}: BlockPatternType ): JSX.Element => {
	const { blocks, viewportWidth } = pattern;
	const instanceId = useInstanceId( BlockPattern );
	const descriptionId = `block-editor-block-patterns-list__item-description-${ instanceId }`;

	return (
		<div
			className="block-editor-block-patterns-list__list-item"
			aria-label={ pattern.title }
			aria-describedby={ pattern.description ? descriptionId : undefined }
		>
			<div
				role="option"
				className="block-editor-block-patterns-list__item"
				onClick={ () => onClick( pattern, blocks ) }
				onKeyUp={ ( event ) => {
					if ( 'Enter' === event.key ) {
						onClick( pattern, blocks );
					} //end if
				} }
				tabIndex={ -1 }
			>
				<BlockPreview
					blocks={ map( blocks, ( block ) => cloneBlock( block ) ) }
					viewportWidth={ viewportWidth }
				/>
				<div className="block-editor-block-patterns-list__item-title">
					{ pattern.title }
				</div>
				{ !! pattern.description && (
					<VisuallyHidden id={ descriptionId }>
						{ pattern.description }
					</VisuallyHidden>
				) }
			</div>
		</div>
	);
};

type BlockPatternListType = {
	readonly blockPatterns: ReadonlyArray< FormPattern >;
	readonly onClickPattern: (
		pattern: FormPattern,
		blocks: ReadonlyArray< BlockInstance >
	) => void;
};
const BlockPatternList = ( {
	blockPatterns,
	onClickPattern,
}: BlockPatternListType ): JSX.Element => {
	return (
		<div
			role="listbox"
			className="block-editor-block-patterns-list"
			aria-label={ _x( 'Form Patterns', 'text', 'nelio-forms' ) }
		>
			{ blockPatterns.map( ( pattern ) => {
				return (
					<BlockPattern
						key={ pattern.name }
						pattern={ pattern }
						onClick={ onClickPattern }
					/>
				);
			} ) }
		</div>
	);
};

export default BlockPatternList;
