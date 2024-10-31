<?php

namespace Nelio_Forms\Fields\Tel;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

add_filter( 'nelio_forms_sanitize_tel_field', 'sanitize_text_field' );

function validate( $errors, $field_submit, $field_properties ) {
	$messages = error_messages( array() )['length'];
	if ( ! empty( $field_submit ) && isset( $field_properties['minLength'] ) && mb_strlen( $field_submit ) < $field_properties['minLength'] ) {
		$errors[] = sprintf( $messages['min_length'], $field_properties['minLength'] );
		return $errors;
	}//end if

	if ( ! empty( $field_submit ) && isset( $field_properties['maxLength'] ) && mb_strlen( $field_submit ) > $field_properties['maxLength'] ) {
		$errors[] = sprintf( $messages['max_length'], $field_properties['maxLength'] );
		return $errors;
	}//end if

	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_tel_field', __NAMESPACE__ . '\validate', 5, 3 );

function error_messages( $messages ) {
	$messages['length'] = array(
		/**
		 * Filters the label used to signal an input that does not respect the minimum length.
		 *
		 * @param string $label min length limit label.
		 *
		 * @since 1.0.17
		 */
		/* translators: a number */
		'min_length' => apply_filters( 'nelio_forms_min_length_label', _x( 'Input text should have at least %s characters.', 'text', 'nelio-forms' ) ),
		/**
		 * Filters the label used to signal an input that does not respect the minimum length.
		 *
		 * @param string $label min length limit label.
		 *
		 * @since 1.0.17
		 */
		/* translators: a number */
		'max_length' => apply_filters( 'nelio_forms_max_length_label', _x( 'Input text can’t exceed %s characters.', 'text', 'nelio-forms' ) ),
	);
	return $messages;
}//end error_messages()
add_filter( 'nelio_forms_error_messages', __NAMESPACE__ . '\error_messages' );
