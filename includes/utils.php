<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function is_nelio_form_editor() {
	if ( ! is_admin() ) {
		return false;
	}//end if

	$get = function( $arr, $key, $sanitize ) {
		return isset( $arr[ $key ] )
			? call_user_func( $sanitize, $arr[ $key ] )
			: '';
	};

	global $pagenow;
	$typenow = '';

	if ( 'post-new.php' === $pagenow ) {
		$typenow = $get( $_REQUEST, 'post_type', 'sanitize_text_field' ); // phpcs:ignore
		$typenow = post_type_exists( $typenow ) ? $typenow : '';
	} elseif ( 'post.php' === $pagenow ) {
		$get_pid  = $get( $_GET, 'post', 'absint' ); // phpcs:ignore
		$post_pid = $get( $_POST, 'post_ID', 'absint' ); // phpcs:ignore

		$pid = $get_pid === $post_pid ? $get_pid : 0;
		$pid = empty( $get_pid ) || empty( $post_pid ) ? max( $get_pid, $post_pid ) : $pid;

		$typenow = empty( $pid ) ? '' : get_post_type( $pid );
	}//end if

	return 'nelio_form' === $typenow;
}//end is_nelio_form_editor()

function nelio_forms_get_script_version( $name ) {
	$file = nelio_forms_path() . "/dist/nelio-forms-{$name}.asset.php";
	if ( ! file_exists( $file ) ) {
		return nelio_forms_version();
	}//end if
	$asset = include $file;
	return $asset['version'];
}//end nelio_forms_get_script_version()

function nelio_forms_register_script( $name ) {
	$file = nelio_forms_path() . "/dist/nelio-forms-{$name}.asset.php";
	if ( ! file_exists( $file ) ) {
		return;
	}//end if

	$asset = include $file;
	// NOTE Bug fix with @wordpress/core-data package.
	$asset['dependencies'] = array_map(
		function( $dep ) {
			return str_replace( 'wp-coreData', 'wp-core-data', $dep );
		},
		$asset['dependencies']
	);

	/**
	 * Filters the list of extra dependencies the given script has.
	 *
	 * @param array  $dependencies List of extra dependencies.
	 * @param string $handler      Script handler.
	 *
	 * @since 1.0.6
	 */
	$extra_deps = apply_filters( 'nelio_forms_extra_dependencies', array(), "nelio-forms-{$name}" );

	$asset['dependencies'] = array_merge( $asset['dependencies'], $extra_deps );
	wp_register_script(
		"nelio-forms-{$name}",
		nelio_forms_url() . "/dist/nelio-forms-{$name}.js",
		array_unique( $asset['dependencies'] ),
		$asset['version'],
		true
	);

	if ( in_array( 'wp-i18n', $asset['dependencies'], true ) ) {
		wp_set_script_translations( "nelio-forms-{$name}", 'nelio-forms' );
	}//end if
}//end nelio_forms_register_script()

function nelio_forms_enqueue_script( $name ) {
	nelio_forms_register_script( $name );
	wp_enqueue_script( "nelio-forms-{$name}" );
}//end nelio_forms_enqueue_script()

function nelio_forms_register_style( $name, $deps = array() ) {
	wp_register_style(
		"nelio-forms-{$name}",
		nelio_forms_url() . "/dist/nelio-forms-{$name}.css",
		$deps,
		nelio_forms_get_script_version( $name )
	);
}//end nelio_forms_register_style()

function nelio_forms_enqueue_style( $name, $deps = array() ) {
	nelio_forms_register_style( $name, $deps );
	wp_enqueue_style( "nelio-forms-{$name}" );
}//end nelio_forms_enqueue_style()

function nelio_forms_process_field( $value, $fields, $form ) {
	$all_fields = '';
	foreach ( $fields as $field ) {
		$field_value = is_bool( $field['value'] ) ? nelio_forms_bool_to_text( $field['value'], $field['type'] ) : $field['value'];
		$field_value = is_array( $field_value ) ? nelio_forms_array_to_text( $field['value'], $field['type'] ) : $field_value;
		$value       = str_replace( "{{$field['id']}}", $field_value, $value );
		$label       = wp_strip_all_tags( $field['label'] );
		$label       = ! empty( $label ) ? $label : $field['id'];
		$all_fields .= "- {$label}: {$field_value}\n";
	}//end foreach

	$value = str_replace( '{admin_email}', get_bloginfo( 'admin_email' ), $value );
	$value = str_replace( '{home_url}', home_url(), $value );
	$value = str_replace( '{form_id}', $form['id'], $value );
	$value = str_replace( '{form_title}', $form['settings']['title'], $value );
	$value = str_replace( '{all_fields}', $all_fields, $value );

	return $value;
}//end nelio_forms_process_field()

function nelio_forms_process_acceptance_field( $value, $fields, $form ) {
	foreach ( $fields as $field ) {
		$field_value = is_array( $field['value'] ) ? nelio_forms_array_to_boolean( $field['value'], $field['type'] ) : $field['value'];
		$value       = str_replace( "{{$field['id']}}", $field_value, $value );
	}//end foreach

	return (bool) $value;
}//end nelio_forms_process_acceptance_field()

function nelio_forms_bool_to_text( $value, $type ) {
	if ( in_array( $type, array( 'checkbox-group', 'checkbox' ), true ) ) {
		return nelio_forms_checkbox_value_to_text( $value );
	}//end if
	return $value ? _x( 'yes', 'text', 'nelio-forms' ) : _x( 'no', 'text', 'nelio-forms' );
}//end nelio_forms_bool_to_text()

function nelio_forms_checkbox_value_to_text( $value ) {
	return $value ? _x( 'Checked', 'text', 'nelio-forms' ) : _x( 'Not checked', 'text', 'nelio-forms' );
}//end nelio_forms_checkbox_value_to_text()

function nelio_forms_array_to_text( $arr, $type ) {
	$map = array_map(
		function( $item, $key ) use ( $type ) {
			/* translators: index */
			$label = empty( $item['label'] ) ? sprintf( _x( 'Item %s', 'text', 'nelio-forms' ), $key ) : $item['label'];
			$value = is_bool( $item['value'] ) ? nelio_forms_bool_to_text( $item['value'], $type ) : $item['value'];
			return "- {$label}: {$value}";
		},
		$arr,
		array_keys( $arr )
	);

	return "\n\t" . implode( "\n\t", $map );
}//end nelio_forms_array_to_text()

function nelio_forms_array_to_boolean( $arr, $type ) {
	$map = array_map(
		function( $item ) {
			$value = is_bool( $item['value'] ) ? $item['value'] : (bool) $item['value'];
			return $value;
		},
		$arr
	);

	return in_array( true, $map, true );
}//end nelio_forms_array_to_boolean()
