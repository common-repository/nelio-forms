export type Attributes = Pick<
	HTMLTextAreaElement,
	| 'id'
	| 'disabled'
	| 'minLength'
	| 'maxLength'
	| 'placeholder'
	| 'readOnly'
	| 'required'
> & {
	readonly isLabelHidden: boolean;
	readonly label: string;
	readonly htmlId: string;
	readonly type: 'textarea';
};
