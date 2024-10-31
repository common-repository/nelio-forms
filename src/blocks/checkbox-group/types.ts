export type Attributes = Pick<
	HTMLInputElement,
	'id' | 'disabled' | 'required' | 'type'
> & {
	readonly label: string;
	readonly htmlId: string;
	readonly options: ReadonlyArray< CheckboxItem >;
};

export type CheckboxItem = {
	readonly label: string;
	readonly checked: boolean;
};
