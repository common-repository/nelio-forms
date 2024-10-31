/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { TextareaControl } from '@wordpress/components';
import { useBlockProps } from '@wordpress/block-editor';
import { _x } from '@wordpress/i18n';
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

const Edit = ( props: BlockEditProps< Attributes > ): JSX.Element => {
	const { attributes, className, clientId, isSelected, setAttributes } =
		props;
	const {
		label = '',
		disabled,
		isLabelHidden,
		placeholder = '',
		required,
	} = attributes;

	useFieldIdsEffect( clientId );

	const applyModifiers = modifiers( { required, disabled } );

	const blockProps = useBlockProps( {
		className: classnames(
			className,
			'wp-block',
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
					isSelected={ isSelected }
					isHidden={ isLabelHidden }
					label={ label }
					onChange={ ( value ) => setAttributes( { label: value } ) }
				/>
				<div className={ applyModifiers( 'nelio-forms-field__value' ) }>
					<TextareaControl
						value={ isSelected ? placeholder : '' }
						placeholder={
							isSelected
								? _x(
										'Type placeholder here…',
										'user',
										'nelio-forms'
								  )
								: placeholder
						}
						autoComplete="off"
						disabled={ disabled }
						onChange={ ( value ) =>
							setAttributes( { placeholder: value } )
						}
					/>
				</div>
			</div>
		</>
	);
};

export default Edit;
