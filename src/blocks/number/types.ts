export type Attributes = Pick<
	HTMLInputElement,
	'id' | 'autocomplete' | 'disabled' | 'placeholder' | 'readOnly' | 'required'
> & {
	readonly customUnit: string;
	readonly customUnitPosition: 'after' | 'before';
	readonly label: string;
	readonly htmlId: string;
	readonly isLabelHidden: boolean;
	readonly min: number;
	readonly max: number;
	readonly showCustomUnit: boolean;
	readonly step: number;
	readonly value: number;
	readonly type: 'number' | 'number-slider';
};
