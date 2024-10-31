<?php

namespace Nelio_Forms\Fields\Time;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function sanitize( $field_submit ) {
	return sanitize_text_field( wp_unslash( $field_submit ) );
}//end sanitize()
add_filter( 'nelio_forms_sanitize_time_field', __NAMESPACE__ . '\sanitize', 5 );

function validate( $errors, $field_submit, $field_properties ) {
	$messages = error_messages( array() )['time'];
	if ( empty( $field_submit ) ) {
		return $errors;
	}//end if

	if ( ! is_valid_time( $field_submit ) ) {
		$errors[] = $messages['invalid'];
	}//end if

	if ( ! empty( $field_properties['min'] ) && is_less_than( $field_submit, $field_properties['min'] ) ) {
		$errors[] = $messages['out-of-range'];
	}//end if

	if ( ! empty( $field_properties['max'] ) && is_greater_than( $field_submit, $field_properties['max'] ) ) {
		$errors[] = $messages['out-of-range'];
	}//end if

	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_time_field', __NAMESPACE__ . '\validate', 5, 3 );

function error_messages( $messages ) {
	$messages['time'] = array(
		/**
		 * Filters the label used to signal a submitted time is invalid.
		 *
		 * @param string $label invalid time label.
		 *
		 * @since 1.0.8
		 */
		'invalid'      => apply_filters( 'nelio_forms_invalid_time_field_label', _x( 'The provided time value is not valid.', 'text', 'nelio-forms' ) ),
		/**
		 * Filters the label used to signal a submitted time is out of defined range.
		 *
		 * @param string $label out of range time label.
		 *
		 * @since 1.0.8
		 */
		'out-of-range' => apply_filters( 'nelio_forms_out_of_range_time_field_label', _x( 'The provided time value does not conform to the required range.', 'text', 'nelio-forms' ) ),
	);
	return $messages;
}//end error_messages()
add_filter( 'nelio_forms_error_messages', __NAMESPACE__ . '\error_messages' );

function is_valid_time( $value ) {
	try {
		$datetime = new \DateTime( $value );
		return true;
	} catch ( Exception $e ) {
		return false;
	}//end try
}//end is_valid_time()

function is_less_than( $t1, $t2 ) {
	try {
		$datetime1 = new \DateTime( $t1 );
		$datetime2 = new \DateTime( $t2 );
		return $datetime1 < $datetime2;
	} catch ( Exception $e ) {
		return false;
	}//end try
}//end is_less_than()

function is_greater_than( $t1, $t2 ) {
	try {
		$datetime1 = new \DateTime( $t1 );
		$datetime2 = new \DateTime( $t2 );
		return $datetime1 > $datetime2;
	} catch ( Exception $e ) {
		return false;
	}//end try
}//end is_greater_than()
