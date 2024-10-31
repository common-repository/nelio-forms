<?php

namespace Nelio_Forms\Actions;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

require_once __DIR__ . '/email-notification.php';

function run_actions( $submitted_fields, $form, $entry ) {
	foreach ( $form['settings']['actions'] as $action ) {
		if ( empty( $action['isActive'] ) ) {
			continue;
		}//end if

		/**
		 * Fires the logic to process form actions.
		 *
		 * @param array $attributes action attributes.
		 * @param array $fields     sanitized entry field values/properties.
		 * @param array $form       form settings/data.
		 * @param array $entry      original `$_POST` global.
		 *
		 * @since 1.0.0
		 */
		do_action( "nelio_forms_process_{$action['type']}_action", $action['attributes'], $submitted_fields, $form, $entry );
	}//end foreach
}//end run_actions()
add_action( 'nelio_forms_process', __NAMESPACE__ . '\run_actions', 10, 3 );
