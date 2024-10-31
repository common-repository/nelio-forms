<?php

namespace Nelio_Forms\Fields\Radio_Group;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function sanitize( $field_submit, $field_properties ) {
	return sanitize_text_field( $field_properties['options'][ absint( $field_submit ) ]['label'] );
}//end sanitize()
add_filter( 'nelio_forms_sanitize_radio-group_field', __NAMESPACE__ . '\sanitize', 5, 2 );

function validate( $errors, $field_submit, $field_properties ) {
	$messages = error_messages( array() )['radio-group'];
	if ( empty( $field_submit ) ) {
		return $errors;
	}//end if

	$index = absint( $field_submit );

	$labels = wp_list_pluck( $field_properties['options'], 'label' );
	if ( empty( $labels[ $index ] ) ) {
		$errors[] = $messages['invalid'];
	}//end if

	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_radio-group_field', __NAMESPACE__ . '\validate', 5, 3 );

function error_messages( $messages ) {
	$messages['radio-group'] = array(
		/**
		 * Filters the label used to signal a submitted value is invalid.
		 *
		 * @param string $label invalid value.
		 *
		 * @since 1.0.13
		 */
		'invalid' => apply_filters( 'nelio_forms_invalid_radio_group_field_value_label', _x( 'The provided value is not valid.', 'text', 'nelio-forms' ) ),
	);
	return $messages;
}//end error_messages()
add_filter( 'nelio_forms_error_messages', __NAMESPACE__ . '\error_messages' );
