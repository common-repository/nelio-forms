/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FormPattern } from '../types';

const blockPatterns = [
	{
		name: 'nelio-forms/contact',
		title: _x( 'Contact form', 'text', 'nelio-forms' ),
		viewportWidth: 500,
		categories: [ 'nelio-forms' ],
		description: '',
		blocks: [
			{
				name: 'nelio-forms/text',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'text-1',
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Name', 'text', 'nelio-forms' ),
					readOnly: false,
					required: true,
					requiresConfirmation: false,
					type: 'text',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Email', 'text', 'nelio-forms' ),
					required: true,
					requiresConfirmation: false,
					type: 'email',
					id: 'email-1',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/textarea',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					required: true,
					type: 'textarea',
					id: 'textarea-1',
					label: _x( 'Message', 'text', 'nelio-forms' ),
				},
				innerBlocks: [],
			},
			{
				name: 'core/buttons',
				isValid: true,
				validationIssues: [],
				attributes: {
					lock: {
						remove: true,
						move: true,
					},
				},
				innerBlocks: [
					{
						name: 'core/button',
						isValid: true,
						validationIssues: [],
						attributes: {
							text: _x( 'Contact Us', 'command', 'nelio-forms' ),
							lock: {
								remove: true,
							},
							nfIsSubmit: true,
						},
						innerBlocks: [],
					},
				],
			},
		],
	},
	{
		name: 'nelio-forms/newsletter-sign-up',
		title: _x( 'Newsletter sign-up', 'text', 'nelio-forms' ),
		viewportWidth: 500,
		categories: [ 'nelio-forms' ],
		description: '',
		blocks: [
			{
				name: 'nelio-forms/text',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'text-1',
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Name', 'text', 'nelio-forms' ),
					readOnly: false,
					required: true,
					requiresConfirmation: false,
					type: 'text',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Email', 'text', 'nelio-forms' ),
					required: true,
					requiresConfirmation: false,
					type: 'email',
					id: 'email-1',
				},
				innerBlocks: [],
			},
			{
				name: 'core/paragraph',
				isValid: true,
				attributes: {
					content: _x(
						'By submitting your information, you’re giving us permission to email you. You may unsubscribe at any time.',
						'user',
						'nelio-forms'
					),
					dropCap: false,
				},
				innerBlocks: [],
			},
			{
				name: 'core/buttons',
				isValid: true,
				validationIssues: [],
				attributes: {
					lock: {
						remove: true,
						move: true,
					},
				},
				innerBlocks: [
					{
						name: 'core/button',
						isValid: true,
						validationIssues: [],
						attributes: {
							text: _x( 'Subscribe', 'command', 'nelio-forms' ),
							lock: {
								remove: true,
							},
							nfIsSubmit: true,
						},
						innerBlocks: [],
					},
				],
			},
		],
	},
	{
		name: 'nelio-forms/rsvp-form',
		title: _x( 'RSVP form', 'text', 'nelio-forms' ),
		viewportWidth: 500,
		categories: [ 'nelio-forms' ],
		description: '',
		blocks: [
			{
				name: 'nelio-forms/text',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'text-1',
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Name', 'text', 'nelio-forms' ),
					readOnly: false,
					required: true,
					requiresConfirmation: false,
					type: 'text',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Email', 'text', 'nelio-forms' ),
					required: true,
					requiresConfirmation: false,
					type: 'email',
					id: 'email-1',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/textarea',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					required: false,
					type: 'textarea',
					id: 'textarea-1',
					label: _x( 'Other Details', 'text', 'nelio-forms' ),
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/radio-group',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					required: true,
					type: 'radio-group',
					options: [
						{
							label: _x( 'Yes', 'text', 'nelio-forms' ),
							checked: true,
						},
						{
							label: _x( 'No', 'text', 'nelio-forms' ),
							checked: false,
						},
					],
					id: 'radio-group-1',
					label: _x( 'Attending?', 'user', 'nelio-forms' ),
				},
				innerBlocks: [],
			},
			{
				name: 'core/buttons',
				isValid: true,
				validationIssues: [],
				attributes: {
					lock: {
						remove: true,
						move: true,
					},
				},
				innerBlocks: [
					{
						name: 'core/button',
						isValid: true,
						validationIssues: [],
						attributes: {
							text: _x( 'Send RSVP', 'command', 'nelio-forms' ),
							lock: {
								remove: true,
							},
							nfIsSubmit: true,
						},
						innerBlocks: [],
					},
				],
			},
		],
	},
	{
		name: 'nelio-forms/registration-form',
		title: _x( 'Registration form', 'text', 'nelio-forms' ),
		viewportWidth: 500,
		categories: [ 'nelio-forms' ],
		description: '',
		blocks: [
			{
				name: 'nelio-forms/text',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'text-1',
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Name', 'text', 'nelio-forms' ),
					readOnly: false,
					required: true,
					requiresConfirmation: false,
					type: 'text',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Email', 'text', 'nelio-forms' ),
					required: true,
					requiresConfirmation: false,
					type: 'email',
					id: 'email-1',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Phone Number', 'text', 'nelio-forms' ),
					required: true,
					requiresConfirmation: false,
					type: 'tel',
					id: 'tel-1',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/select',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					isEditingOptions: false,
					required: false,
					type: 'select',
					options: [
						{
							label: _x( 'Search Engine', 'text', 'nelio-forms' ),
							value: 'search-engine',
							selected: false,
							disabled: false,
						},
						{
							label: _x( 'Social Media', 'text', 'nelio-forms' ),
							value: 'social-media',
							selected: false,
							disabled: false,
						},
						{
							label: _x( 'TV', 'text', 'nelio-forms' ),
							value: 'tv',
							selected: false,
							disabled: false,
						},
						{
							selected: false,
							disabled: false,
							label: _x( 'Radio', 'text', 'nelio-forms' ),
							value: 'radio',
						},
						{
							selected: false,
							disabled: false,
							label: _x(
								'Friend or Family',
								'text',
								'nelio-forms'
							),
							value: 'friend-family',
						},
					],
					id: 'select-1',
					label: _x(
						'How did you hear about us?',
						'user',
						'nelio-forms'
					),
					placeholder: _x(
						'Select an option…',
						'user',
						'nelio-forms'
					),
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/textarea',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					required: true,
					type: 'textarea',
					id: 'textarea-1',
					label: _x( 'Other Details', 'text', 'nelio-forms' ),
				},
				innerBlocks: [],
			},
			{
				name: 'core/buttons',
				isValid: true,
				validationIssues: [],
				attributes: {
					lock: {
						remove: true,
						move: true,
					},
				},
				innerBlocks: [
					{
						name: 'core/button',
						isValid: true,
						validationIssues: [],
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
		],
	},
	{
		name: 'nelio-forms/appointment-form',
		title: _x( 'Appointment form', 'text', 'nelio-forms' ),
		viewportWidth: 500,
		categories: [ 'nelio-forms' ],
		description: '',
		blocks: [
			{
				name: 'nelio-forms/text',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'text-1',
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Name', 'text', 'nelio-forms' ),
					readOnly: false,
					required: true,
					requiresConfirmation: false,
					type: 'text',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Email', 'text', 'nelio-forms' ),
					required: true,
					requiresConfirmation: false,
					type: 'email',
					id: 'email-1',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Phone Number', 'text', 'nelio-forms' ),
					required: true,
					requiresConfirmation: false,
					type: 'tel',
					id: 'tel-1',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/datetime',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Date', 'text', 'nelio-forms' ),
					step: 1,
					required: true,
					type: 'datetime',
					id: 'datetime-1',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/textarea',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					required: true,
					type: 'textarea',
					id: 'textarea-1',
					label: _x( 'Notes', 'text', 'nelio-forms' ),
				},
				innerBlocks: [],
			},
			{
				name: 'core/buttons',
				isValid: true,
				validationIssues: [],
				attributes: {
					lock: {
						remove: true,
						move: true,
					},
				},
				innerBlocks: [
					{
						name: 'core/button',
						isValid: true,
						validationIssues: [],
						attributes: {
							text: _x(
								'Book Appointment',
								'command',
								'nelio-forms'
							),
							lock: {
								remove: true,
							},
							nfIsSubmit: true,
						},
						innerBlocks: [],
					},
				],
			},
		],
	},
	{
		name: 'nelio-forms/feedback-form',
		title: _x( 'Feedback form', 'text', 'nelio-forms' ),
		viewportWidth: 500,
		categories: [ 'nelio-forms' ],
		description: '',
		blocks: [
			{
				name: 'nelio-forms/text',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'text-1',
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Name', 'text', 'nelio-forms' ),
					readOnly: false,
					required: true,
					requiresConfirmation: false,
					type: 'text',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Email', 'text', 'nelio-forms' ),
					required: true,
					requiresConfirmation: false,
					type: 'email',
					id: 'email-1',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/radio-group',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					required: true,
					type: 'radio-group',
					options: [
						{
							label: _x( 'Very Bad', 'text', 'nelio-forms' ),
							checked: false,
						},
						{
							label: _x( 'Poor', 'text', 'nelio-forms' ),
							checked: false,
						},
						{
							label: _x( 'Average', 'text', 'nelio-forms' ),
							checked: false,
						},
						{
							label: _x( 'Good', 'text', 'nelio-forms' ),
							checked: false,
						},
						{
							label: _x( 'Excellent', 'text', 'nelio-forms' ),
							checked: true,
						},
					],
					id: 'radio-group-1',
					label: _x(
						'Please rate our website',
						'user',
						'nelio-forms'
					),
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/textarea',
				isValid: true,
				attributes: {
					disabled: false,
					isLabelHidden: false,
					required: false,
					type: 'textarea',
					id: 'textarea-1',
					label: _x( 'How could we improve', 'user', 'nelio-forms' ),
				},
				innerBlocks: [],
			},
			{
				name: 'core/buttons',
				isValid: true,
				validationIssues: [],
				attributes: {
					lock: {
						remove: true,
						move: true,
					},
				},
				innerBlocks: [
					{
						name: 'core/button',
						isValid: true,
						validationIssues: [],
						attributes: {
							text: _x(
								'Send Feedback',
								'command',
								'nelio-forms'
							),
							lock: {
								remove: true,
							},
							nfIsSubmit: true,
						},
						innerBlocks: [],
					},
				],
			},
		],
	},
	{
		name: 'nelio-forms/customer-information-form',
		title: _x( 'Customer information form', 'text', 'nelio-forms' ),
		viewportWidth: 800,
		categories: [ 'nelio-forms' ],
		description: '',
		blocks: [
			{
				name: 'core/paragraph',
				isValid: true,
				validationIssues: [],
				attributes: {
					content: _x(
						'Please, fill the customer information form below to join. Fields marked with a red start are mandatory.',
						'user',
						'nelio-forms'
					),
					dropCap: false,
				},
				innerBlocks: [],
			},
			{
				name: 'core/paragraph',
				isValid: true,
				validationIssues: [],
				attributes: {
					content: _x( 'Customer Name', 'text', 'nelio-forms' ),
					dropCap: false,
					fontSize: 'medium',
				},
				innerBlocks: [],
			},
			{
				name: 'core/columns',
				isValid: true,
				validationIssues: [],
				attributes: {
					isStackedOnMobile: true,
				},
				innerBlocks: [
					{
						name: 'core/column',
						isValid: true,
						validationIssues: [],
						attributes: {},
						innerBlocks: [
							{
								name: 'nelio-forms/select',
								isValid: true,
								validationIssues: [],
								attributes: {
									id: 'select-2',
									disabled: false,
									isLabelHidden: false,
									isEditingOptions: false,
									label: _x( 'Title', 'text', 'nelio-forms' ),
									placeholder: _x(
										'Title',
										'text',
										'nelio-forms'
									),
									required: true,
									type: 'select',
									options: [
										{
											label: _x(
												'Mr',
												'text',
												'nelio-forms'
											),
											value: _x(
												'Mr',
												'text',
												'nelio-forms'
											),
											disabled: false,
											selected: false,
										},
										{
											label: _x(
												'Mrs',
												'text',
												'nelio-forms'
											),
											value: _x(
												'Mrs',
												'text',
												'nelio-forms'
											),
											selected: false,
											disabled: false,
										},
										{
											selected: false,
											disabled: false,
											label: _x(
												'Miss',
												'text',
												'nelio-forms'
											),
											value: _x(
												'Miss',
												'text',
												'nelio-forms'
											),
										},
										{
											selected: false,
											disabled: false,
											label: _x(
												'Ms',
												'text',
												'nelio-forms'
											),
											value: _x(
												'Ms',
												'text',
												'nelio-forms'
											),
										},
										{
											selected: false,
											disabled: false,
											label: _x(
												'Dr',
												'text',
												'nelio-forms'
											),
											value: _x(
												'Dr',
												'text',
												'nelio-forms'
											),
										},
										{
											selected: false,
											disabled: false,
											label: _x(
												'Other',
												'text',
												'nelio-forms'
											),
											value: _x(
												'Other',
												'text',
												'nelio-forms'
											),
										},
										{
											label: _x(
												'Title',
												'text',
												'nelio-forms'
											),
											value: _x(
												'Title',
												'text',
												'nelio-forms'
											),
											selected: false,
											disabled: false,
										},
									],
								},
								innerBlocks: [],
							},
						],
					},
					{
						name: 'core/column',
						isValid: true,
						validationIssues: [],
						attributes: {},
						innerBlocks: [
							{
								name: 'nelio-forms/text',
								isValid: true,
								validationIssues: [],
								attributes: {
									id: 'text-3',
									disabled: false,
									isLabelHidden: false,
									label: _x(
										'First Name',
										'text',
										'nelio-forms'
									),
									placeholder: _x(
										'First Name',
										'text',
										'nelio-forms'
									),
									required: true,
									requiresConfirmation: false,
									type: 'text',
								},
								innerBlocks: [],
							},
						],
					},
					{
						name: 'core/column',
						isValid: true,
						validationIssues: [],
						attributes: {},
						innerBlocks: [
							{
								name: 'nelio-forms/text',
								isValid: true,
								validationIssues: [],
								attributes: {
									id: 'text-4',
									disabled: false,
									isLabelHidden: false,
									label: _x(
										'Last Name',
										'text',
										'nelio-forms'
									),
									placeholder: _x(
										'Last Name',
										'text',
										'nelio-forms'
									),
									required: true,
									requiresConfirmation: false,
									type: 'text',
								},
								innerBlocks: [],
							},
						],
					},
				],
			},
			{
				name: 'core/paragraph',
				isValid: true,
				validationIssues: [],
				attributes: {
					content: _x( 'Customer Address', 'text', 'nelio-forms' ),
					dropCap: false,
					fontSize: 'medium',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'text-2',
					disabled: false,
					isLabelHidden: true,
					label: _x( 'Street Address', 'text', 'nelio-forms' ),
					placeholder: _x( 'Street Address', 'text', 'nelio-forms' ),
					required: true,
					requiresConfirmation: false,
					type: 'text',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'text-1',
					disabled: false,
					isLabelHidden: true,
					label: _x( 'Street Address Line 2', 'text', 'nelio-forms' ),
					placeholder: _x(
						'Street Address Line 2',
						'text',
						'nelio-forms'
					),
					readOnly: false,
					required: false,
					requiresConfirmation: false,
					type: 'text',
				},
				innerBlocks: [],
			},
			{
				name: 'core/columns',
				isValid: true,
				validationIssues: [],
				attributes: {
					isStackedOnMobile: true,
				},
				innerBlocks: [
					{
						name: 'core/column',
						isValid: true,
						validationIssues: [],
						attributes: {},
						innerBlocks: [
							{
								name: 'nelio-forms/text',
								isValid: true,
								validationIssues: [],
								attributes: {
									id: 'text-5',
									disabled: false,
									isLabelHidden: true,
									label: _x( 'City', 'text', 'nelio-forms' ),
									placeholder: _x(
										'City',
										'text',
										'nelio-forms'
									),
									required: true,
									requiresConfirmation: false,
									type: 'text',
								},
								innerBlocks: [],
							},
						],
					},
					{
						name: 'core/column',
						isValid: true,
						validationIssues: [],
						attributes: {},
						innerBlocks: [
							{
								name: 'nelio-forms/text',
								isValid: true,
								validationIssues: [],
								attributes: {
									id: 'text-6',
									disabled: false,
									isLabelHidden: true,
									label: _x(
										'Region',
										'text',
										'nelio-forms'
									),
									placeholder: _x(
										'Region',
										'text',
										'nelio-forms'
									),
									required: true,
									requiresConfirmation: false,
									type: 'text',
								},
								innerBlocks: [],
							},
						],
					},
				],
			},
			{
				name: 'core/buttons',
				isValid: true,
				validationIssues: [],
				attributes: {
					lock: {
						remove: true,
						move: true,
					},
				},
				innerBlocks: [
					{
						name: 'core/button',
						isValid: true,
						validationIssues: [],
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
		],
	},
	{
		name: 'nelio-forms/three-columns-form',
		title: _x( 'Three columns form', 'text', 'nelio-forms' ),
		viewportWidth: 800,
		categories: [ 'nelio-forms' ],
		description: '',
		blocks: [
			{
				name: 'core/columns',
				isValid: true,
				validationIssues: [],
				attributes: {
					isStackedOnMobile: true,
				},
				innerBlocks: [
					{
						name: 'core/column',
						isValid: true,
						validationIssues: [],
						attributes: {},
						innerBlocks: [
							{
								name: 'nelio-forms/text',
								isValid: true,
								validationIssues: [],
								attributes: {
									id: 'text-2',
									disabled: false,
									isLabelHidden: true,
									label: _x(
										'First Name',
										'text',
										'nelio-forms'
									),
									placeholder: _x(
										'Your First Name…',
										'text',
										'nelio-forms'
									),
									required: true,
									requiresConfirmation: false,
									type: 'text',
								},
								innerBlocks: [],
							},
						],
					},
					{
						name: 'core/column',
						isValid: true,
						validationIssues: [],
						attributes: {},
						innerBlocks: [
							{
								name: 'nelio-forms/text',
								isValid: true,
								validationIssues: [],
								attributes: {
									id: 'email-1',
									disabled: false,
									isLabelHidden: true,
									label: _x( 'Email', 'text', 'nelio-forms' ),
									placeholder: _x(
										'Your Email…',
										'text',
										'nelio-forms'
									),
									required: true,
									requiresConfirmation: false,
									type: 'email',
								},
								innerBlocks: [],
							},
						],
					},
					{
						name: 'core/column',
						isValid: true,
						validationIssues: [],
						attributes: {},
						innerBlocks: [
							{
								name: 'core/button',
								isValid: true,
								validationIssues: [],
								attributes: {
									text: _x(
										'Submit',
										'command',
										'nelio-forms'
									),
									width: 100,
									lock: {
										remove: true,
									},
									nfIsSubmit: true,
								},
								innerBlocks: [],
							},
						],
					},
				],
			},
		],
	},
	{
		name: 'nelio-forms/discount-form',
		title: _x( 'Discount form', 'text', 'nelio-forms' ),
		viewportWidth: 500,
		categories: [ 'nelio-forms' ],
		description: '',
		blocks: [
			{
				name: 'core/paragraph',
				isValid: true,
				validationIssues: [],
				attributes: {
					align: 'center',
					content: _x(
						'Claim your 50% off discount code',
						'user',
						'nelio-forms'
					),
					dropCap: false,
					fontSize: 'large',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'email-1',
					disabled: false,
					isLabelHidden: true,
					label: _x( 'Email', 'text', 'nelio-forms' ),
					placeholder: _x(
						'Enter your email…',
						'user',
						'nelio-forms'
					),
					required: true,
					requiresConfirmation: false,
					type: 'email',
				},
				innerBlocks: [],
			},
			{
				name: 'core/buttons',
				isValid: true,
				validationIssues: [],
				attributes: {
					lock: {
						remove: true,
						move: true,
					},
				},
				innerBlocks: [
					{
						name: 'core/button',
						isValid: true,
						validationIssues: [],
						attributes: {
							text: _x( 'Claim Discount', 'user', 'nelio-forms' ),
							width: 100,
							lock: {
								remove: true,
							},
							nfIsSubmit: true,
						},
						innerBlocks: [],
					},
				],
			},
		],
	},
	{
		name: 'nelio-forms/event-sign-up-form',
		title: _x( 'Event sign-up form', 'text', 'nelio-forms' ),
		viewportWidth: 500,
		categories: [ 'nelio-forms' ],
		description: '',
		blocks: [
			{
				name: 'core/columns',
				isValid: true,
				validationIssues: [],
				attributes: {
					isStackedOnMobile: true,
				},
				innerBlocks: [
					{
						name: 'core/column',
						isValid: true,
						validationIssues: [],
						attributes: {},
						innerBlocks: [
							{
								name: 'nelio-forms/text',
								isValid: true,
								validationIssues: [],
								attributes: {
									id: 'text-2',
									disabled: false,
									isLabelHidden: false,
									label: _x(
										'First Name',
										'text',
										'nelio-forms'
									),
									placeholder: _x(
										'First Name',
										'text',
										'nelio-forms'
									),
									required: true,
									requiresConfirmation: false,
									type: 'text',
								},
								innerBlocks: [],
							},
						],
					},
					{
						name: 'core/column',
						isValid: true,
						validationIssues: [],
						attributes: {},
						innerBlocks: [
							{
								name: 'nelio-forms/text',
								isValid: true,
								validationIssues: [],
								attributes: {
									id: 'text-3',
									disabled: false,
									isLabelHidden: false,
									label: _x(
										'Last Name',
										'text',
										'nelio-forms'
									),
									placeholder: _x(
										'Last Name',
										'text',
										'nelio-forms'
									),
									required: true,
									requiresConfirmation: false,
									type: 'text',
								},
								innerBlocks: [],
							},
						],
					},
				],
			},
			{
				name: 'nelio-forms/text',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'email-1',
					disabled: false,
					isLabelHidden: false,
					label: _x( 'Your Email', 'text', 'nelio-forms' ),
					placeholder: _x(
						'e.g. email@example.com',
						'text',
						'nelio-forms'
					),
					required: true,
					requiresConfirmation: false,
					type: 'email',
				},
				innerBlocks: [],
			},
			{
				name: 'core/paragraph',
				isValid: true,
				validationIssues: [],
				attributes: {
					content: _x(
						'You will receive your confirmation by email',
						'text',
						'nelio-forms'
					),
					dropCap: false,
					fontSize: 'small',
				},
				innerBlocks: [],
			},
			{
				name: 'nelio-forms/radio-group',
				isValid: true,
				validationIssues: [],
				attributes: {
					id: 'radio-group-1',
					disabled: false,
					label: _x(
						'Will You Be Attending?',
						'user',
						'nelio-forms'
					),
					isLabelHidden: false,
					required: true,
					type: 'radio-group',
					options: [
						{
							label: _x( 'Yes', 'text', 'nelio-forms' ),
							checked: true,
						},
						{
							label: _x( 'No', 'text', 'nelio-forms' ),
							checked: false,
						},
					],
					className: 'is-style-horizontal-layout',
				},
				innerBlocks: [],
			},
			{
				name: 'core/buttons',
				isValid: true,
				validationIssues: [],
				attributes: {
					lock: {
						remove: true,
						move: true,
					},
				},
				innerBlocks: [
					{
						name: 'core/button',
						isValid: true,
						validationIssues: [],
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
		],
	},
];

export function getFormPatterns(): ReadonlyArray< FormPattern > {
	return applyFilters(
		'nelio_forms.form_patterns',
		blockPatterns
	) as ReadonlyArray< FormPattern >;
} //end getFormPatterns()
