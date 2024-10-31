export type Attributes = Pick<
	HTMLInputElement,
	| 'id'
	| 'autocomplete'
	| 'disabled'
	| 'maxLength'
	| 'minLength'
	| 'pattern'
	| 'placeholder'
	| 'readOnly'
	| 'required'
	| 'size'
	| 'type'
> & {
	readonly label: string;
	readonly htmlId: string;
	readonly isLabelHidden: boolean;
	readonly requiresConfirmation: boolean;
	readonly confirmationPlaceholder: string;
};
