export type Attributes = Pick<
	HTMLSelectElement,
	'id' | 'disabled' | 'required' | 'type'
> & {
	readonly label: string;
	readonly htmlId: string;
	readonly isLabelHidden: boolean;
	readonly isEditingOptions: boolean;
	readonly placeholder: string;
	readonly options: ReadonlyArray< OptionItem | OptionGroup >;
};

export type OptionGroup = {
	readonly label: string;
	readonly disabled: boolean;
	readonly options: ReadonlyArray< OptionItem >;
};

export type OptionItem = {
	readonly label: string;
	readonly value: string;
	readonly selected: boolean;
	readonly disabled: boolean;
};
