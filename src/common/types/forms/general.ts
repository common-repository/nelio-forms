export type GeneralSettings = {
	readonly submitProcessingLabel: string;
	readonly onValidSubmission: OnValidSubmissionSettings;
};

export type OnValidSubmissionSettings =
	| {
			readonly type: 'redirect';
			readonly redirection: string;
	  }
	| { readonly type: 'hide-form'; readonly message: string }
	| { readonly type: 'none'; readonly message: string };
