<?php

namespace Nelio_Forms\Form_Editor;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function enqueue_generic_assets() {
	nelio_forms_enqueue_script( 'gutenberg' );

	$settings = get_form_editor_settings();
	wp_add_inline_script(
		'nelio-forms-gutenberg',
		sprintf(
			'NelioFormsSettings = %s;',
			wp_json_encode( $settings )
		),
		'before'
	);
}//end enqueue_generic_assets()
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_generic_assets' );

function enqueue_form_assets() {
	if ( get_post_type() !== 'nelio_form' ) {
		return;
	}//end if

	nelio_forms_enqueue_style( 'form-editor' );
	nelio_forms_enqueue_script( 'form-editor' );
}//end enqueue_form_assets()
add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\enqueue_form_assets' );

function get_form_editor_settings() {
	$post_statuses_per_post_type = array_map(
		function ( $name ) {
			return get_post_statuses( $name );
		},
		get_post_types()
	);

	$settings = array(
		'addParentLimit' => ! is_nelio_form_editor(),
		'allowedBlocks'  => \Nelio_Forms\Config\allowed_form_block_types(),
		'activePlugins'  => get_active_plugins(),
		'postStatuses'   => $post_statuses_per_post_type,
		'userRoles'      => get_editable_roles(),
		'siteUrl'        => trailingslashit( get_site_url() ),
	);

	return apply_filters( 'nelio_forms_editor_settings', $settings );
}//end get_form_editor_settings()

function get_active_plugins() {
	$clean_extension = function( $plugin ) {
		return substr( $plugin, 0, -4 );
	};

	$plugins = array_keys( get_plugins() );
	$actives = array_map( 'is_plugin_active', $plugins );
	$plugins = array_combine( $plugins, $actives );
	$plugins = array_keys( array_filter( $plugins ) );
	$plugins = array_map( $clean_extension, $plugins );

	return $plugins;
}//end get_active_plugins()

function get_post_statuses( $post_type ) {
	$statuses = array(
		array(
			'name'  => 'draft',
			'label' => __( 'Draft' ),
		),
		array(
			'name'  => 'pending',
			'label' => __( 'Pending' ),
		),
		array(
			'name'  => 'future',
			'label' => __( 'Scheduled' ),
		),
		array(
			'name'  => 'publish',
			'label' => __( 'Published' ),
		),
	);

	/**
	 * Filters the available post statuses for a given post type.
	 *
	 * Each status must contain a `name` and a `label`.
	 *
	 * @param array  $statues   list of post statuses.
	 * @param string $post_type post type.
	 *
	 * @since 1.0.10
	 */
	return apply_filters( 'nelio_forms_post_statuses', $statuses, $post_type );
}//end get_post_statuses()

function wp_kses_allowed_html( $tags, $context ) {
	if ( 'post' !== $context ) {
		return $tags;
	}//end if

	$expected_tags = array( 'form', 'input', 'textarea' );
	foreach ( $expected_tags as $tag ) {
		if ( ! isset( $tags[ $tag ] ) ) {
			$tags[ $tag ] = array();
		}//end if
	}//end foreach

	return array_merge(
		$tags,
		array(
			'form'     => array_merge(
				$tags['form'],
				array(
					'method' => true,
					'id'     => true,
					'action' => true,
					'style'  => true,
				)
			),
			'input'    => array_merge(
				$tags['input'],
				array(
					'autocomplete' => true,
					'class'        => true,
					'disabled'     => true,
					'id'           => true,
					'max'          => true,
					'maxLength'    => true,
					'min'          => true,
					'minLength'    => true,
					'name'         => true,
					'pattern'      => true,
					'placeholder'  => true,
					'readonly'     => true,
					'required'     => true,
					'size'         => true,
					'style'        => true,
					'type'         => true,
					'value'        => true,
				)
			),
			'textarea' => array_merge(
				$tags['textarea'],
				array(
					'class'       => true,
					'id'          => true,
					'maxLength'   => true,
					'name'        => true,
					'placeholder' => true,
					'readonly'    => true,
					'required'    => true,
					'style'       => true,
					'type'        => true,
					'cols'        => true,
				)
			),
		)
	);
}//end wp_kses_allowed_html()

add_filter(
	'wp_insert_post_data',
	function( $data, $postarr, $unsanitized ) {
		if ( 'nelio_form' !== $data['post_type'] ) {
			return $data;
		}//end if

		if ( ! isset( $unsanitized['post_content'] ) ) {
			return $data;
		}//end if

		// Workaround: make sure a self-closing tag has a space before the closing chars.
		$post_content_raw = $unsanitized['post_content'];
		$post_content_raw = preg_replace( '/([^ ])\/>/', '$1 />', $post_content_raw );

		add_filter( 'wp_kses_allowed_html', __NAMESPACE__ . '\wp_kses_allowed_html', 10, 2 );
		$data['post_content'] = sanitize_post_field( 'post_content', $post_content_raw, $postarr['ID'], 'db' );
		remove_filter( 'wp_kses_allowed_html', __NAMESPACE__ . '\wp_kses_allowed_html', 10, 2 );
		return $data;
	},
	10,
	3
);

add_filter(
	'nelio_popups_extended_post_types',
	function( $post_types ) {
		$key = array_search( 'nelio_form', $post_types );
		if ( false !== $key ) {
			unset( $post_types[ $key ] );
			$post_types = array_values( $post_types );
		}//end if
		return $post_types;
	}
);
