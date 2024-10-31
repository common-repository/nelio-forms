/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { CheckboxControl } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { modifiers } from '@nelio/forms/utils';
import { FieldLabel } from '@nelio/forms/components';
import { useFieldIdsEffect } from '@nelio/forms/hooks';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import BlockToolbar from './toolbar';
import type { Attributes } from './types';
import './editor.scss';

const Edit = ( props: BlockEditProps< Attributes > ): JSX.Element => {
	const { attributes, className, clientId, isSelected, setAttributes } =
		props;
	const { label, checked, disabled, required } = attributes;

	useFieldIdsEffect( clientId );

	const applyModifiers = modifiers( { checkbox: true, required, disabled } );

	const blockProps = useBlockProps( {
		className: classnames(
			className,
			applyModifiers( 'nelio-forms-field' )
		),
	} );

	return (
		<>
			{ isSelected && <Inspector { ...props } /> }
			{ isSelected && <BlockToolbar { ...props } /> }
			<div { ...blockProps }>
				<div className={ applyModifiers( 'nelio-forms-field__value' ) }>
					<CheckboxControl
						checked={ checked }
						autoComplete="off"
						disabled={ disabled }
						onChange={ ( value ) =>
							setAttributes( { checked: value } )
						}
					/>
				</div>
				<FieldLabel
					className={ applyModifiers( 'nelio-forms-field__label' ) }
					label={ label }
					isSelected={ isSelected }
					isHidden={ false }
					onChange={ ( value ) => setAttributes( { label: value } ) }
				/>
			</div>
		</>
	);
};

export default Edit;
