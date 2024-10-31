/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
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
import { EditableOptionList, SelectPreview } from './components';
import type { Attributes } from './types';
import './editor.scss';

const Edit = ( props: BlockEditProps< Attributes > ): JSX.Element => {
	const { attributes, className, clientId, isSelected, setAttributes } =
		props;
	const {
		label = '',
		disabled,
		isEditingOptions,
		isLabelHidden,
		required,
	} = attributes;

	useFieldIdsEffect( clientId );

	const applyModifiers = modifiers( {
		select: true,
		required,
		disabled,
	} );

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
				<FieldLabel
					className={ applyModifiers( 'nelio-forms-field__label' ) }
					label={ label }
					isSelected={ isSelected }
					isHidden={ isLabelHidden }
					onChange={ ( value ) => setAttributes( { label: value } ) }
				/>
				<div className={ applyModifiers( 'nelio-forms-field__value' ) }>
					<SelectPreview { ...props } />
					{ isEditingOptions && <EditableOptionList { ...props } /> }
				</div>
			</div>
		</>
	);
};

export default Edit;
