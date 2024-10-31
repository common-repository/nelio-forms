<?php

namespace Nelio_Forms\Fields\Text;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function sanitize( $field_submit ) {
	return sanitize_text_field( wp_unslash( $field_submit ) );
}//end sanitize()
add_filter( 'nelio_forms_sanitize_text_field', __NAMESPACE__ . '\sanitize', 5 );

function validate( $errors, $field_submit, $field_properties, $form ) {
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
		if ( "{{$field_id}}" === $user_action['attributes']['username'] ) {
			if ( empty( $field_submit ) ) {
				$errors[] = $messages['empty_user_login'];
				break;
			}//end if

			if ( mb_strlen( $field_submit ) > 60 ) {
				$errors[] = $messages['user_login_too_long'];
				break;
			}//end if

			$illegal_logins = (array) apply_filters( 'illegal_user_logins', array() );
			if ( in_array( strtolower( $field_submit ), array_map( 'strtolower', $illegal_logins ), true ) ) {
				$errors[] = $messages['invalid_username'];
				break;
			}//end if

			if ( username_exists( $field_submit ) ) {
				$errors[] = $messages['existing_user_login'];
				break;
			}//end if
		}//end if

		if ( "{{$field_id}}" === $user_action['attributes']['email'] ) {
			if ( email_exists( $field_submit ) ) {
				$errors[] = $messages['existing_user_email'];
				break;
			}//end if
		}//end if
	}//end foreach

	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_text_field', __NAMESPACE__ . '\validate', 5, 4 );

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
	$messages['user']   = array(
		/**
		 * Filters the label used to signal an empty user login.
		 *
		 * @param string $label empty user login label.
		 *
		 * @since 1.0.10
		 */
		'empty_user_login'    => apply_filters( 'nelio_forms_empty_user_login_label', _x( 'Cannot create a user with an empty login name.', 'text', 'nelio-forms' ) ),
		/**
		 * Filters the label used to signal an user login too long.
		 *
		 * @param string $label user login too long label.
		 *
		 * @since 1.0.10
		 */
		'user_login_too_long' => apply_filters( 'nelio_forms_user_login_too_long_label', _x( 'Username may not be longer than 60 characters.', 'text', 'nelio-forms' ) ),
		/**
		 * Filters the label used to signal an invalid username.
		 *
		 * @param string $label invalid username.
		 *
		 * @since 1.0.10
		 */
		'invalid_username'    => apply_filters( 'nelio_forms_invalid_username_label', _x( 'Sorry, that username is not allowed.', 'text', 'nelio-forms' ) ),
		/**
		 * Filters the label used to signal an existing user with that email already exists.
		 *
		 * @param string $label existing user login label.
		 *
		 * @since 1.0.10
		 */
		'existing_user_login' => apply_filters( 'nelio_forms_existing_user_login_label', _x( 'Sorry, that username already exists!', 'text', 'nelio-forms' ) ),
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
