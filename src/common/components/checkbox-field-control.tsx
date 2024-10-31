/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { BaseControl, SelectControl } from '@wordpress/components';
import { useInstanceId } from '@wordpress/compose';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { truncate } from 'lodash';
import { useFieldBlocks } from '@nelio/forms/hooks';
import { stripTags } from '@nelio/forms/utils';

export type CheckboxFieldControlProps = {
	readonly label: string;
	readonly defaultOption?: SelectControl.Option;
	readonly value?: string;
	readonly help?: string;
	readonly onChange: ( value: string ) => void;
};
export const CheckboxFieldControl = (
	props: CheckboxFieldControlProps
): JSX.Element => {
	const { defaultOption, label, help, value, onChange } = props;
	const instanceId = useInstanceId( CheckboxFieldControl );
	const fieldBlocks = useFieldBlocks();
	const checkboxes = fieldBlocks.filter(
		( field ) => field.name === 'nelio-forms/checkbox'
	);
	const options = [
		...( defaultOption ? [ defaultOption ] : [] ),
		...checkboxes.map( ( field ) => ( {
			label: truncate(
				stripTags(
					field.label !== field.id
						? `${ field.label } ({${ field.id }})`
						: `{${ field.id }}`
				),
				{
					length: 40,
				}
			),
			value: `{${ field.id }}`,
		} ) ),
	];
	return (
		<BaseControl
			id={ `${ instanceId }` }
			label={ label }
			help={
				checkboxes.length === 0
					? _x(
							'Add a checkbox field in the form to select it here.',
							'user',
							'nelio-forms'
					  )
					: help
			}
		>
			<SelectControl
				value={ value }
				options={ options }
				onChange={ onChange }
			/>
		</BaseControl>
	);
};
