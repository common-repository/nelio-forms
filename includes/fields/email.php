<?php

namespace Nelio_Forms\Fields\Email;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

add_filter( 'nelio_forms_sanitize_email_field', 'sanitize_email' );

function validate( $errors, $field_submit, $field_properties, $form ) {
	$messages = error_messages( array() )['email'];
	if ( ! empty( $field_submit ) && ! is_email( $field_submit ) ) {
		$errors[] = $messages['invalid'];
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

	$messages = error_messages( array() )['user'];
	$field_id = $field_properties['id'];
	$actions  = $form['settings']['actions'];

	$user_registration_actions = array_values(
		array_filter(
			$actions,
			function( $action ) {
				return 'user-registration' === $action['type'] && $action['isActive'];
			}
		)
	);

	foreach ( $user_registration_actions as $user_action ) {
		if ( "{{$field_id}}" === $user_action['attributes']['email'] ) {
			if ( email_exists( $field_submit ) ) {
				$errors[] = $messages['existing_user_email'];
				break;
			}//end if
		}//end if
	}//end foreach

	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_email_field', __NAMESPACE__ . '\validate', 5, 4 );

function error_messages( $messages ) {
	$messages['email']  = array(
		/**
		 * Filters the label used to signal a submitted email is invalid.
		 *
		 * @param string $label invalid email label.
		 *
		 * @since 1.0.0
		 */
		'invalid' => apply_filters( 'nelio_forms_invalid_email_field_label', _x( 'The provided email is not valid.', 'text', 'nelio-forms' ) ),
	);
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
	$messages['user']   = array(
		/**
		 * Filters the label used to signal an existing user with that email already exists.
		 *
		 * @param string $label existing user email label.
		 *
		 * @since 1.0.10
		 */
		'existing_user_email' => apply_filters( 'nelio_forms_existing_user_email_label', _x( 'Sorry, that email address is already used!', 'text', 'nelio-forms' ) ),
	);
	return $messages;
}//end error_messages()
add_filter( 'nelio_forms_error_messages', __NAMESPACE__ . '\error_messages' );
