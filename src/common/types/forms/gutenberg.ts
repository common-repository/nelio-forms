import type { ActionInstance } from './actions';
import type { EntrySettings } from './entries';
import type { GeneralSettings } from './general';
import type { SpamSettings } from './spam';

export type FormMetas = {
	readonly actions: ReadonlyArray< ActionInstance< unknown > >;
	readonly general: GeneralSettings;
	readonly spam: SpamSettings;
	readonly entries: EntrySettings;
};

export type PrefixedFormMetas = {
	[ A in keyof FormMetas as `nelio_forms_${ keyof FormMetas }` ]: FormMetas[ A ];
};
