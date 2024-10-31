<?php

namespace Nelio_Forms\Fields\Select;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

add_filter( 'nelio_forms_sanitize_select_field', 'sanitize_text_field' );

function validate( $errors, $field_submit, $field_properties ) {
	$messages = error_messages( array() )['select'];
	if ( empty( $field_submit ) ) {
		return $errors;
	}//end if

	$values = array_reduce(
		$field_properties['options'],
		function( $carry, $item ) {
			if ( ! isset( $item['options'] ) && ! $item['disabled'] ) {
				$value = empty( $item['value'] ) ? $item['label'] : $item['value'];
				return array_merge( $carry, array( $value ) );
			}//end if

			if ( isset( $item['options'] ) && is_array( $item['options'] ) && ! $item['disabled'] ) {
				$enabled_options = array_values(
					array_filter(
						$item['options'],
						function( $inner_item ) {
							return ! $inner_item['disabled'];
						}
					)
				);

				$values = array_map(
					function ( $item ) {
						return empty( $item['value'] ) ? $item['label'] : $item['value'];
					},
					$enabled_options
				);

				return array_merge( $carry, $values );
			}//end if

			return $carry;
		},
		array()
	);

	if ( ! in_array( sanitize_text_field( $field_submit ), $values, true ) ) {
		$errors[] = $messages['invalid'];
	}//end if

	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_select_field', __NAMESPACE__ . '\validate', 5, 3 );

function error_messages( $messages ) {
	$messages['select'] = array(
		/**
		 * Filters the label used to signal a submitted value is invalid.
		 *
		 * @param string $label invalid value.
		 *
		 * @since 1.0.13
		 */
		'invalid' => apply_filters( 'nelio_forms_invalid_select_field_value_label', _x( 'The provided value is not valid.', 'text', 'nelio-forms' ) ),
	);
	return $messages;
}//end error_messages()
add_filter( 'nelio_forms_error_messages', __NAMESPACE__ . '\error_messages' );
