// eslint-disable-next-line import/named
import { usePostMeta } from './wordpress';

import type { AttrSetter, FormMetas } from '@nelio/forms/types';

export function useFormMeta< A extends keyof FormMetas >(
	name: A,
	ref?: number
): AttrSetter< FormMetas[ A ] > {
	const [ value, setValue ] = usePostMeta< FormMetas[ A ] >(
		`nelio_forms_${ name }`,
		ref
	);

	return [ value, setValue ];
} //end useFormMeta()
