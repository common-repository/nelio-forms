/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n';
import { v4 as uuid } from 'uuid';

/**
 * TODO: Any change made here must be replicated in: includes/forms.php
 */
export const DEFAULT_FORM_CONTENT = [
	{
		clientId: uuid(),
		name: 'nelio-forms/text',
		isValid: true,
		attributes: {
			disabled: false,
			id: 'text-1',
			label: '',
			readOnly: false,
			required: true,
			type: 'text',
		},
		innerBlocks: [],
	},
	{
		clientId: uuid(),
		name: 'core/buttons',
		isValid: true,
		attributes: {
			lock: {
				remove: true,
				move: true,
			},
		},
		innerBlocks: [
			{
				clientId: uuid(),
				name: 'core/button',
				isValid: true,
				attributes: {
					text: _x( 'Submit', 'command', 'nelio-forms' ),
					lock: {
						remove: true,
					},
					nfIsSubmit: true,
				},
				innerBlocks: [],
			},
		],
	},
];
