/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { TextControl } from '@wordpress/components';
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

const Edit = ( props: BlockEditProps< Attributes > ): JSX.Element => {
	const { attributes, className, clientId, isSelected, setAttributes } =
		props;
	const {
		label,
		disabled,
		isLabelHidden,
		min,
		max,
		required,
		step,
		type,
		value = '',
	} = attributes;

	useFieldIdsEffect( clientId );

	const applyModifiers = modifiers( { required, disabled } );

	const blockProps = useBlockProps( {
		className: classnames(
			className,
			applyModifiers( 'nelio-forms-field' )
		),
	} );

	const controlType = type === 'datetime' ? 'datetime-local' : type;

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
					onChange={ ( newLabel ) =>
						setAttributes( { label: newLabel } )
					}
				/>
				<div className={ applyModifiers( 'nelio-forms-field__value' ) }>
					<TextControl
						type={ controlType }
						value={ value }
						min={ min }
						max={ max }
						step={ step }
						autoComplete="off"
						disabled={ disabled }
						onChange={ ( newValue ) =>
							setAttributes( { value: newValue } )
						}
					/>
				</div>
			</div>
		</>
	);
};

export default Edit;
