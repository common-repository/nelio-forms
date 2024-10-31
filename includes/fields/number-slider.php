<?php

namespace Nelio_Forms\Fields\NumberSlider;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function sanitize( $field_submit ) {
	return intval( wp_unslash( $field_submit ) );
}//end sanitize()
add_filter( 'nelio_forms_sanitize_number-slider_field', __NAMESPACE__ . '\sanitize', 5 );

function validate( $errors, $field_submit, $field_properties ) {
	return $errors;
}//end validate()
add_filter( 'nelio_forms_validate_number-slider_field', __NAMESPACE__ . '\validate', 5, 3 );
