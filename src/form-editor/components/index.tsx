/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { useSelect } from '@wordpress/data';
/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import {
	FormActionSettings,
	FormGeneralSettings,
	FormPatterns,
	FormSpamSettings,
} from '@nelio/forms/components';
import { useFormMeta } from '@nelio/forms/hooks';

export const FormEditorExtensions = (): JSX.Element => {
	const [ actions, setActions ] = useFormMeta( 'actions' );
	const [ generalSettings, setGeneralSettings ] = useFormMeta( 'general' );
	const [ spamSettings, setSpamSettings ] = useFormMeta( 'spam' );

	const formId = useSelect< number >( ( select ) =>
		select( 'core/editor' ).getEditedPostAttribute( 'id' )
	);

	const EntryRecordingComponent = applyFilters(
		'nelio_forms.get_entry_recording_component',
		() => null
	) as () => JSX.Element | null;

	return (
		<>
			<PluginDocumentSettingPanel
				name="nelio-forms-patterns-panel"
				className="nelio-forms-patterns-panel"
				initialOpen={ false }
				title={ _x( 'Patterns', 'text', 'nelio-forms' ) }
			>
				<FormPatterns />
			</PluginDocumentSettingPanel>
			<PluginDocumentSettingPanel
				name="nelio-forms-general-settings-panel"
				className="nelio-forms-general-settings-panel"
				initialOpen={ true }
				title={ _x( 'General Settings', 'text', 'nelio-forms' ) }
			>
				<FormGeneralSettings
					{ ...{ generalSettings, setGeneralSettings } }
				/>
			</PluginDocumentSettingPanel>
			<PluginDocumentSettingPanel
				name="nelio-forms-actions-settings-panel"
				className="nelio-forms-actions-settings-panel"
				initialOpen={ true }
				title={ _x( 'Submission Actions', 'text', 'nelio-forms' ) }
			>
				<EntryRecordingComponent />
				<FormActionSettings { ...{ formId, actions, setActions } } />
			</PluginDocumentSettingPanel>
			<PluginDocumentSettingPanel
				name="nelio-forms-spam-settings-panel"
				className="nelio-forms-spam-settings-panel"
				initialOpen={ false }
				title={ _x( 'Spam Detection', 'text', 'nelio-forms' ) }
			>
				<FormSpamSettings { ...{ spamSettings, setSpamSettings } } />
			</PluginDocumentSettingPanel>
		</>
	);
};
