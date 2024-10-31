export type Attributes = Pick<
	HTMLInputElement,
	'id' | 'disabled' | 'required' | 'type'
> & {
	readonly label: string;
	readonly htmlId: string;
	readonly isLabelHidden: boolean;
	readonly options: ReadonlyArray< RadioItem >;
};

export type RadioItem = {
	readonly label: string;
	readonly checked: boolean;
};
