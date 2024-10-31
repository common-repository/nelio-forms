export type Attributes = Pick<
	HTMLInputElement,
	'id' | 'checked' | 'disabled' | 'required' | 'type'
> & {
	readonly label: string;
	readonly htmlId: string;
};
