<?php

namespace Nelio_Forms\Css;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function maybe_enqueue_opinionated_style() {
	/**
	 * Filters the opinionated style to load.
	 *
	 * @param string $style Name of the opinionated style. Either `light`, `dark`, or `none`. Default: `light`.
	 *
	 * @since 1.0.20
	 */
	$style_name = apply_filters( 'nelio_forms_opinionated_style', 'light' );
	if ( 'light' !== $style_name && 'dark' !== $style_name ) {
		return;
	}//end if

	wp_enqueue_style(
		'nelio-forms-opinionated-style',
		nelio_forms_url() . '/dist/opinionated-style.css',
		array( 'nelio-forms-form-style' ),
		nelio_forms_version()
	);

	/**
	 * Filters the colors of either the “light” or the “dark” opinionated styles.
	 *
	 * Colors are:
	 *
	 * <ul>
	 *   <li>`accent-color`: the accent color.</li>
	 *   <li>`error`: text color for error messages.</li>
	 *   <li>`error-icon-background`: background color for error icon.</li>
	 *   <li>`error-icon-foreground`: color for error icon.</li>
	 *   <li>`field-placeholder`: color for field placeholders.</li>
	 *   <li>`field-text`: color for field values.</li>
	 *   <li>`focused-field-background`: background color for focused fields.</li>
	 *   <li>`focused-field-border`: border color for focused fields.</li>
	 *   <li>`label`: text color of field label.</li>
	 *   <li>`outline`: outline color of focused fields. </li>
	 *   <li>`required-marker`: color of “required field” marker.</li>
	 *   <li>`unfocused-field-background`: background color for unfocused fields.</li>
	 *   <li>`unfocused-field-border`: border color for unfocused fields.</li>
	 * </ul>
	 *
	 * @param array $colors Current CSS colors.
	 *
	 * @since 1.0.20
	 */
	$colors = apply_filters(
		"nelio_forms_css_{$style_name}_colors",
		array(
			'accent-color'               => '#333',
			'error'                      => '#e80000',
			'error-icon-background'      => '#e80000',
			'error-icon-foreground'      => '#fff',
			'field-placeholder'          => '#919191',
			'field-text'                 => '#333',
			'focused-field-background'   => '#fff',
			'focused-field-border'       => '#919191',
			'label'                      => 'currentcolor',
			'outline'                    => '#333',
			'required-marker'            => '#f00',
			'unfocused-field-background' => '#f7f7f7',
			'unfocused-field-border'     => '#c4c4c4',
		)
	);
	$colors = array_map(
		function( $key, $color ) {
			return "--nelio-forms-{$key}: {$color};";
		},
		array_keys( $colors ),
		array_values( $colors )
	);

	wp_add_inline_style(
		'nelio-forms-opinionated-style',
		sprintf( 'form.nelio-forms-form { %s }', implode( ' ', $colors ) )
	);
}//end maybe_enqueue_opinionated_style()
add_action( 'nelio_forms_after_form_fields', __NAMESPACE__ . '\maybe_enqueue_opinionated_style' );

function get_dark_colors( $colors ) {
	return array_merge(
		$colors,
		array(
			'accent-color'               => '#ddd',
			'field-placeholder'          => '#aaa',
			'field-text'                 => '#ddd',
			'focused-field-background'   => '#333',
			'focused-field-border'       => '#ddd',
			'label'                      => 'currentcolor',
			'outline'                    => '#ddd',
			'unfocused-field-background' => '#222',
			'unfocused-field-border'     => '#ddd',
		)
	);
}//end get_dark_colors()
add_action( 'nelio_forms_css_dark_colors', __NAMESPACE__ . '\get_dark_colors', 5 );
