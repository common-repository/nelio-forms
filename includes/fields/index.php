<?php

namespace Nelio_Forms\Fields;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

require_once __DIR__ . '/checkbox.php';
require_once __DIR__ . '/checkbox-group.php';
require_once __DIR__ . '/datetime.php';
require_once __DIR__ . '/date.php';
require_once __DIR__ . '/number.php';
require_once __DIR__ . '/number-slider.php';
require_once __DIR__ . '/text.php';
require_once __DIR__ . '/email.php';
require_once __DIR__ . '/password.php';
require_once __DIR__ . '/radio-group.php';
require_once __DIR__ . '/select.php';
require_once __DIR__ . '/tel.php';
require_once __DIR__ . '/url.php';
require_once __DIR__ . '/textarea.php';
require_once __DIR__ . '/time.php';

function validate( $errors, $field_submit, $field_properties ) {
	$messages = error_messages( array() )['generic'];
	if ( ! empty( $field_properties['required'] ) && empty( $field_submit ) && '0' !== (string) $field_submit ) {
		$errors[] = $messages['required'];
	}//end if

	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_field', __NAMESPACE__ . '\validate', 5, 3 );

function error_messages( $messages ) {
	$messages['generic'] = array(
		/**
		 * Filters the label used to signal a required field is missing.
		 *
		 * @param string $label missing required field.
		 *
		 * @since 1.0.0
		 */
		'required' => apply_filters( 'nelio_forms_required_field_label', _x( 'This field is required.', 'text', 'nelio-forms' ) ),
		/**
		 * Filters the label used to signal an unknown error in a field.
		 *
		 * @param string $label unknown error field.
		 *
		 * @since 1.0.7
		 */
		'unknown'  => apply_filters( 'nelio_forms_unknown_error_field_label', _x( 'This field has errors.', 'text', 'nelio-forms' ) ),
	);
	return $messages;
}//end error_messages()
add_filter( 'nelio_forms_error_messages', __NAMESPACE__ . '\error_messages' );
