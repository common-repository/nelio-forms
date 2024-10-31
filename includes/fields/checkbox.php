<?php

namespace Nelio_Forms\Fields\Checkbox;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function sanitize( $field_submit ) {
	return ! empty( $field_submit );
}//end sanitize()
add_filter( 'nelio_forms_sanitize_checkbox_field', __NAMESPACE__ . '\sanitize', 5, 1 );

function validate( $errors, $field_submit, $field_properties ) {
	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_checkbox_field', __NAMESPACE__ . '\validate', 5, 3 );
