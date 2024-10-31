<?php

namespace Nelio_Forms\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function register_block_types() {
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}//end if

	$blocks = get_block_names();
	foreach ( $blocks as $block ) {
		register_block_type(
			nelio_forms_path() . "/dist/blocks/{$block}"
		);
	}//end foreach
}//end register_block_types()
add_action( 'init', __NAMESPACE__ . '\register_block_types' );

function get_types() {
	$block_types = array_map(
		function( $name ) {
			$path = nelio_forms_path() . "/dist/blocks/{$name}/block.json";
			return wp_json_file_decode( $path, array( 'associative' => true ) );
		},
		get_block_names()
	);

	// NOTE. Do we need a filter or something?
	return array_combine(
		wp_list_pluck( $block_types, 'name' ),
		$block_types
	);
}//end get_types()

function get_block_names() {
	// NOTE. `nelio-forms/form` is registered in server.
	// NOTE. Do we need a filter or something?
	return array(
		'checkbox',
		'checkbox-group',
		'datetime',
		'number',
		'radio-group',
		'select',
		'text',
		'textarea',
	);
}//end get_block_names()
