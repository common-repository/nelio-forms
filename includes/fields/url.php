<?php

namespace Nelio_Forms\Fields\URL;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

add_filter( 'nelio_forms_sanitize_url_field', 'sanitize_url' );

function validate( $errors, $field_submit ) {
	$messages = error_messages( array() )['length'];
	if ( ! empty( $field_submit ) && isset( $field_properties['minLength'] ) && mb_strlen( $field_submit ) < $field_properties['minLength'] ) {
		$errors[] = sprintf( $messages['min_length'], $field_properties['minLength'] );
		return $errors;
	}//end if

	if ( ! empty( $field_submit ) && isset( $field_properties['maxLength'] ) && mb_strlen( $field_submit ) > $field_properties['maxLength'] ) {
		$errors[] = sprintf( $messages['max_length'], $field_properties['maxLength'] );
		return $errors;
	}//end if

	$messages = error_messages( array() )['url'];
	$regex    = '((https?|ftp)\:\/\/)?';
	$regex   .= '([a-z0-9+!*(),;?&=$_.-]+(\:[a-z0-9+!*(),;?&=$_.-]+)?@)?';
	$regex   .= '([a-z0-9-.]*)\.([a-z]{2,3})';
	$regex   .= '(\:[0-9]{2,5})?';
	$regex   .= '(\/([a-z0-9+$_-]\.?)+)*\/?';
	$regex   .= '(\?[a-z+&$_.-][a-z0-9;:@&%=+\/$_.-]*)?';
	$regex   .= '(#[a-z_.-][a-z0-9+$_.-]*)?';

	if ( ! empty( $field_submit ) && ! preg_match( "/^$regex$/i", sanitize_text_field( $field_submit ) ) ) {
		$errors[] = $messages['invalid'];
	}//end if

	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_url_field', __NAMESPACE__ . '\validate', 5, 2 );

function error_messages( $messages ) {
	$messages['url']    = array(
		/**
		 * Filters the label used to signal a submitted URL is invalid.
		 *
		 * @param string $label invalid URL label.
		 *
		 * @since 1.0.0
		 */
		'invalid' => apply_filters( 'nelio_forms_invalid_url_field_label', _x( 'Invalid URL.', 'text', 'nelio-forms' ) ),
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
	return $messages;
}//end error_messages()
add_filter( 'nelio_forms_error_messages', __NAMESPACE__ . '\error_messages' );
