<?php

namespace Nelio_Forms\Fields\Password;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function sanitize( $field_submit ) {
	$value = wp_unslash( $field_submit );
	return is_array( $value ) ? array_map( 'sanitize_text_field', $value )[0] : sanitize_text_field( $value );
}//end sanitize()
add_filter( 'nelio_forms_sanitize_password_field', __NAMESPACE__ . '\sanitize', 5 );

function validate( $errors, $field_submit, $field_properties ) {
	$messages = error_messages( array() )['password'];
	if ( empty( $field_submit ) ) {
		return $errors;
	}//end if

	$messages = error_messages( array() )['length'];
	if ( ! empty( $field_submit ) && isset( $field_properties['minLength'] ) && mb_strlen( $field_submit ) < $field_properties['minLength'] ) {
		$errors[] = sprintf( $messages['min_length'], $field_properties['minLength'] );
		return $errors;
	}//end if

	if ( ! empty( $field_submit ) && isset( $field_properties['maxLength'] ) && mb_strlen( $field_submit ) > $field_properties['maxLength'] ) {
		$errors[] = sprintf( $messages['max_length'], $field_properties['maxLength'] );
		return $errors;
	}//end if

	if ( $field_properties['requiresConfirmation']
		&& is_array( $field_submit )
		&& count( $field_submit ) === 2
		&& ! empty( $field_submit[0] )
		&& ! empty( $field_submit[1] )
		&& $field_submit[0] !== $field_submit[1] ) {
		$errors[] = $messages['do-not-match'];
	}//end if

	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_password_field', __NAMESPACE__ . '\validate', 5, 3 );

function error_messages( $messages ) {
	$messages['length']   = array(
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
	$messages['password'] = array(
		/**
		 * Filters the label used to signal submitted values do not match.
		 *
		 * @param string $label passwords do not match label.
		 *
		 * @since 1.0.12
		 */
		'do-not-match' => apply_filters( 'nelio_forms_password_field_does_not_match_label', _x( 'Field values do not match.', 'text', 'nelio-forms' ) ),
	);
	return $messages;
}//end error_messages()
add_filter( 'nelio_forms_error_messages', __NAMESPACE__ . '\error_messages' );
