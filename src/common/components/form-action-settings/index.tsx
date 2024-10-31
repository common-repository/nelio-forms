/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';

/**
 * External dependencies
 */
import type { ActionInstance } from '@nelio/forms/types';

/**
 * Internal dependencies
 */
import { ActionListControl } from './action-list-control';

export type FormActionSettingsProps = {
	readonly formId: number;
	readonly actions: ReadonlyArray< ActionInstance >;
	readonly setActions: ( actions: ReadonlyArray< ActionInstance > ) => void;
};

export const FormActionSettings = (
	props: FormActionSettingsProps
): JSX.Element => {
	return <ActionListControl { ...props } />;
};
