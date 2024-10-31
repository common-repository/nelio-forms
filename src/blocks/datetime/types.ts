export type Attributes = Pick<
	HTMLInputElement,
	'id' | 'autocomplete' | 'disabled' | 'placeholder' | 'readOnly' | 'required'
> & {
	readonly label: string;
	readonly htmlId: string;
	readonly isLabelHidden: boolean;
	readonly min: string;
	readonly max: string;
	readonly step: number;
	readonly value: string;
	readonly type: 'date' | 'time' | 'datetime';
};
