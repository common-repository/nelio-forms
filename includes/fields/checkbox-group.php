<?php

namespace Nelio_Forms\Fields\Checkbox_Group;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function sanitize( $field_submit, $field_properties ) {
	if ( ! is_array( $field_submit ) ) {
		$field_submit = array( $field_submit );
	}//end if

	return array_map(
		function( $option, $key ) use ( $field_submit ) {
			return array(
				'label' => $option['label'],
				'value' => ! empty( $field_submit[ $key ] ),
			);
		},
		$field_properties['options'],
		array_keys( $field_properties['options'] )
	);
}//end sanitize()
add_filter( 'nelio_forms_sanitize_checkbox-group_field', __NAMESPACE__ . '\sanitize', 5, 2 );

function validate( $errors, $field_submit, $field_properties ) {
	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_checkbox-group_field', __NAMESPACE__ . '\validate', 5, 3 );
