/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import type { AkismetSettings, SpamSettings } from '@nelio/forms/types';
import { TextFieldControl } from '@nelio/forms/components';
import { getFormEditorSettings } from '@nelio/forms/utils';

export type SpamSettingsProps = {
	readonly spamSettings: SpamSettings;
	readonly setSpamSettings: ( settings: SpamSettings ) => void;
};

export const FormSpamSettings = (
	props: SpamSettingsProps
): JSX.Element | null => {
	const { spamSettings, setSpamSettings } = props;

	const isAkismetActive =
		getFormEditorSettings().activePlugins.includes( 'akismet/akismet' );

	if ( ! isAkismetActive ) {
		return (
			<>
				{ _x(
					'Install and activate Akismet with an API key to enable spam check.',
					'user',
					'nelio-forms'
				) }
			</>
		);
	} //end if

	return (
		<>
			<ToggleControl
				label={ _x(
					'Protect your form entries from spam using Akismet',
					'user',
					'nelio-forms'
				) }
				checked={ spamSettings.enabled }
				onChange={ ( checked ) =>
					setSpamSettings(
						checked
							? {
									enabled: true,
									akismet: {
										custom: false,
									},
							  }
							: { enabled: false }
					)
				}
			/>
			{ spamSettings.enabled && (
				<>
					<ToggleControl
						label={ _x(
							'Customize data sent into the Akismet service for analysis',
							'user',
							'nelio-forms'
						) }
						checked={ spamSettings.akismet.custom }
						onChange={ ( checked ) =>
							setSpamSettings( {
								...spamSettings,
								akismet: {
									name: '',
									email: '',
									url: '',
									content: '',
									...spamSettings.akismet,
									custom: checked,
								},
							} )
						}
					/>
					<AkismetCustomFields
						akismet={ spamSettings.akismet }
						onChange={ ( akismet ) =>
							setSpamSettings( { ...spamSettings, akismet } )
						}
					/>
				</>
			) }
		</>
	);
};

type AkismetCustomFieldsProps = {
	readonly akismet: AkismetSettings;
	readonly onChange: ( settings: AkismetSettings ) => void;
};
const AkismetCustomFields = (
	props: AkismetCustomFieldsProps
): JSX.Element | null => {
	const { akismet, onChange } = props;
	if ( ! akismet.custom ) {
		return null;
	} //end if

	const { name, email, url, content } = akismet;

	return (
		<>
			<TextFieldControl
				value={ name }
				label={ _x( 'Name', 'text', 'nelio-forms' ) }
				onChange={ ( value ) =>
					onChange( { ...akismet, name: value } )
				}
			/>
			<TextFieldControl
				type="email"
				value={ email }
				label={ _x( 'Email Address', 'text', 'nelio-forms' ) }
				onChange={ ( value ) =>
					onChange( { ...akismet, email: value } )
				}
			/>
			<TextFieldControl
				type="url"
				value={ url }
				label={ _x( 'Website URL', 'text', 'nelio-forms' ) }
				onChange={ ( value ) => onChange( { ...akismet, url: value } ) }
			/>
			<TextFieldControl
				value={ content }
				label={ _x( 'Content', 'text', 'nelio-forms' ) }
				isMultiline={ true }
				onChange={ ( value ) =>
					onChange( { ...akismet, content: value } )
				}
			/>
		</>
	);
};
