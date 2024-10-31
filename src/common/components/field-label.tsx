/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { Icon } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { css } from '@nelio/forms/css';

export type FieldLabelProps = {
	readonly className: string;
	readonly isSelected: boolean;
	readonly isHidden: boolean;
	readonly label: string;
	readonly onChange: ( label: string ) => void;
};

export const FieldLabel = ( {
	className,
	isHidden,
	isSelected,
	label,
	onChange,
}: FieldLabelProps ): JSX.Element => {
	const isWarningVisible = ! label && ! isSelected;
	const isHiddenIconVisible = ! isWarningVisible && isHidden && isSelected;
	const isRichTextVisible = ! isHidden || isSelected || ! label;

	return (
		<div className={ CUSTOM_STYLE }>
			{ isWarningVisible && (
				<Icon
					icon="warning"
					title={ _x(
						'To ensure your form is accessible, every field should have a descriptive label. If you’d like to hide the label, you can do so by enabling “Hide label” in the field settings.',
						'text',
						'nelio-forms'
					) }
				/>
			) }
			{ isHiddenIconVisible && (
				<Icon
					icon="hidden"
					title={ _x( 'Label is hidden.', 'text', 'nelio-forms' ) }
				/>
			) }
			{ isRichTextVisible && (
				<RichText
					tagName="div"
					className={ className }
					placeholder={ _x(
						'Type label here…',
						'user',
						'nelio-forms'
					) }
					value={
						! isSelected && ! label
							? _x( 'Empty label', 'text', 'nelio-forms' )
							: label
					}
					onChange={ onChange }
					{ ...{ disableLineBreaks: true } }
				/>
			) }
		</div>
	);
};

// ======
// STYLES
// ======

const CUSTOM_STYLE = css( {
	display: 'flex',
	gap: '0.2em',
	alignItems: 'center',

	'& .dashicons-warning': {
		backgroundColor: 'white',
		borderRadius: '100%',
		color: '#ffb900',
	},
} );
