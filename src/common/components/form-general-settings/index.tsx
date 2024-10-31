/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { SelectControl, TextControl } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import type {
	GeneralSettings,
	OnValidSubmissionSettings,
} from '@nelio/forms/types';

export type GeneralSettingsProps = {
	readonly generalSettings: GeneralSettings;
	readonly setGeneralSettings: ( settings: GeneralSettings ) => void;
};

export const FormGeneralSettings = (
	props: GeneralSettingsProps
): JSX.Element | null => {
	const { generalSettings, setGeneralSettings } = props;
	const { onValidSubmission, submitProcessingLabel } = generalSettings;

	const VALID_SUBMISSION_LABELS: Record<
		OnValidSubmissionSettings[ 'type' ],
		string
	> = {
		none: _x( 'Do nothing', 'command', 'nelio-forms' ),
		redirect: _x( 'Redirect to another URL', 'command', 'nelio-forms' ),
		'hide-form': _x( 'Hide form', 'command', 'nelio-forms' ),
	};
	const VALID_SUBMISSION_OPTIONS = Object.keys( VALID_SUBMISSION_LABELS ).map(
		( value: OnValidSubmissionSettings[ 'type' ] ) => ( {
			value,
			label: VALID_SUBMISSION_LABELS[ value ],
		} )
	);

	const DEFAULT_MESSAGE = _x(
		'Form submitted successfully.',
		'text',
		'nelio-forms'
	);

	return (
		<>
			<TextControl
				value={ submitProcessingLabel }
				label={ _x(
					'Submit button processing label',
					'user',
					'nelio-forms'
				) }
				help={ _x(
					'Enter the submit button text you would like to display while the form submit is processing.',
					'user',
					'nelio-forms'
				) }
				onChange={ ( value ) =>
					setGeneralSettings( {
						...generalSettings,
						submitProcessingLabel: value,
					} )
				}
			/>
			<SelectControl
				label={ _x(
					'Action after valid submission',
					'user',
					'nelio-forms'
				) }
				options={ VALID_SUBMISSION_OPTIONS }
				onChange={ ( newType: OnValidSubmissionSettings[ 'type' ] ) =>
					setGeneralSettings( {
						...generalSettings,
						onValidSubmission:
							'redirect' === newType
								? {
										type: newType,
										redirection: '',
								  }
								: { type: newType, message: DEFAULT_MESSAGE },
					} )
				}
			/>
			{ onValidSubmission.type === 'redirect' && (
				<TextControl
					value={ onValidSubmission.redirection }
					type="email"
					label={ _x( 'Redirection URL', 'text', 'nelio-forms' ) }
					onChange={ ( value ) =>
						setGeneralSettings( {
							...generalSettings,
							onValidSubmission: {
								...onValidSubmission,
								redirection: value,
							},
						} )
					}
				/>
			) }
			{ onValidSubmission.type !== 'redirect' && (
				<TextControl
					value={ onValidSubmission.message }
					label={ _x(
						'Message after valid submission',
						'text',
						'nelio-forms'
					) }
					onChange={ ( value ) =>
						setGeneralSettings( {
							...generalSettings,
							onValidSubmission: {
								...onValidSubmission,
								message: value,
							},
						} )
					}
				/>
			) }
		</>
	);
};
