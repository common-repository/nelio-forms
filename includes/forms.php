<?php

namespace Nelio_Forms\Forms;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function register_forms() {

	$labels = array(
		'name'                  => _x( 'Nelio Forms', 'Post Type General Name', 'nelio-forms' ),
		'singular_name'         => _x( 'Form', 'Post Type Singular Name', 'nelio-forms' ),
		'menu_name'             => __( 'Nelio Forms', 'nelio-forms' ),
		'name_admin_bar'        => __( 'Form', 'nelio-forms' ),
		'archives'              => __( 'Form Archives', 'nelio-forms' ),
		'attributes'            => __( 'Form Attributes', 'nelio-forms' ),
		'parent_item_colon'     => __( 'Parent Form:', 'nelio-forms' ),
		'all_items'             => __( 'All Forms', 'nelio-forms' ),
		'add_new_item'          => __( 'Add New Form', 'nelio-forms' ),
		'add_new'               => __( 'Add New', 'nelio-forms' ),
		'new_item'              => __( 'New Form', 'nelio-forms' ),
		'edit_item'             => __( 'Edit Form', 'nelio-forms' ),
		'update_item'           => __( 'Update Form', 'nelio-forms' ),
		'view_item'             => __( 'View Form', 'nelio-forms' ),
		'view_items'            => __( 'View Forms', 'nelio-forms' ),
		'search_items'          => __( 'Search Form', 'nelio-forms' ),
		'not_found'             => __( 'Not found', 'nelio-forms' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'nelio-forms' ),
		'featured_image'        => __( 'Featured Image', 'nelio-forms' ),
		'set_featured_image'    => __( 'Set featured image', 'nelio-forms' ),
		'remove_featured_image' => __( 'Remove featured image', 'nelio-forms' ),
		'use_featured_image'    => __( 'Use as featured image', 'nelio-forms' ),
		'insert_into_item'      => __( 'Insert into form', 'nelio-forms' ),
		'uploaded_to_this_item' => __( 'Uploaded to this form', 'nelio-forms' ),
		'items_list'            => __( 'Forms list', 'nelio-forms' ),
		'items_list_navigation' => __( 'Forms list navigation', 'nelio-forms' ),
		'filter_items_list'     => __( 'Filter forms list', 'nelio-forms' ),
	);

	$args = array(
		'can_export'          => true,
		'description'         => __( 'Nelio Forms', 'nelio-forms' ),
		'exclude_from_search' => true,
		'has_archive'         => false,
		'hierarchical'        => false,
		'label'               => __( 'Form', 'nelio-forms' ),
		'labels'              => $labels,
		'menu_icon'           => get_icon(),
		'menu_position'       => 25,
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => true,
		'rewrite'             => false,
		'show_in_rest'        => true,
		'map_meta_cap'        => true,
		'supports'            => array( 'title', 'editor', 'revisions' ),
		'template'            => get_new_form_template(),
		'capability_type'     => 'nelio_form',
	);

	register_post_type( 'nelio_form', $args );
}//end register_forms()
add_action( 'init', __NAMESPACE__ . '\register_forms', 5 );

function register_forms_meta() {
	$fields = array( 'actions', 'general', 'spam' );
	foreach ( $fields as $short_field ) {
		$field = "nelio_forms_{$short_field}";
		register_rest_field(
			'nelio_form',
			$field,
			array(
				'get_callback'    => function( $params ) use ( $field ) {
					return get_post_meta( $params['id'], "_{$field}", true );
				},
				'update_callback' => function( $value, $object ) use ( $short_field, $field ) {
					$prev_value = get_post_meta( $object->ID, "_{$field}", true );
					/**
					* Filters the value of a form meta field before updating it.
					*
					* @param mixed $meta_value Metadata value.
					* @param mixed $prev_value Optional. Previous value to check before updating.
					*
					* @since 1.0.10
					*/
					$value = apply_filters( "nelio_forms_update_{$short_field}_meta", $value, $prev_value );
					update_post_meta( $object->ID, "_{$field}", $value );
				},
			)
		);
	}//end foreach
}//end register_forms_meta()
add_action( 'init', __NAMESPACE__ . '\register_forms_meta', 5 );

function allowed_block_types( $allowed_block_types, $block_editor_context ) {
	$post = $block_editor_context->post;
	return (
		! $post || 'nelio_form' !== $post->post_type
			? $allowed_block_types
			: \Nelio_Forms\Config\allowed_form_block_types()
		);
}//end allowed_block_types()
add_filter( 'allowed_block_types_all', __NAMESPACE__ . '\allowed_block_types', 10, 2 );

function maybe_get_default_general_settings( $value, $object_id, $meta_key, $single ) {
	if ( '_nelio_forms_general' !== $meta_key ) {
		return $value;
	}//end if

	remove_action( 'get_post_metadata', __NAMESPACE__ . '\maybe_get_default_general_settings', 10, 4 );
	$value = get_post_meta( $object_id, $meta_key, $single );
	add_action( 'get_post_metadata', __NAMESPACE__ . '\maybe_get_default_general_settings', 10, 4 );

	if ( ! is_array( $value ) || empty( $value ) ) {
		$value = array(
			'submitProcessingLabel' => _x( 'Submitting…', 'text', 'nelio-forms' ),
			'onValidSubmission'     => array(
				'type'    => 'none',
				'message' => apply_filters( 'nelio_forms_successful_submission_message', _x( 'Form submitted successfully.', 'text', 'nelio-forms' ) ),
			),
		);
	}//end if

	return $single ? array( $value ) : $value;
}//end maybe_get_default_general_settings()
add_action( 'get_post_metadata', __NAMESPACE__ . '\maybe_get_default_general_settings', 10, 4 );

function maybe_get_default_actions( $value, $object_id, $meta_key, $single ) {
	if ( '_nelio_forms_actions' !== $meta_key ) {
		return $value;
	}//end if

	remove_action( 'get_post_metadata', __NAMESPACE__ . '\maybe_get_default_actions', 10, 4 );
	$value = get_post_meta( $object_id, $meta_key, $single );
	add_action( 'get_post_metadata', __NAMESPACE__ . '\maybe_get_default_actions', 10, 4 );

	if ( ! is_array( $value ) || empty( $value ) ) {
		$value = array(
			array(
				'id'       => "default-email-notification-{$object_id}",
				'type'     => 'email-notification',
				'isActive' => true,
			),
		);
	}//end if

	$value = array_map(
		function( $action, $index ) use ( $object_id ) {
			$action = wp_parse_args(
				$action,
				array(
					'id'         => "default-id-{$object_id}-{$index}",
					'type'       => 'unknown',
					'name'       => '',
					'isActive'   => false,
					'attributes' => array(),
				)
			);

			/**
			 * Parses the given action.
			 *
			 * @param array $action the action to parse.
			 *
			 * @since 1.0.0
			 */
			return apply_filters( "nelio_forms_parse_{$action['type']}_action", $action );
		},
		$value,
		array_keys( $value )
	);

	return $single ? array( $value ) : $value;
}//end maybe_get_default_actions()
add_action( 'get_post_metadata', __NAMESPACE__ . '\maybe_get_default_actions', 10, 4 );

function the_form_title( $title ) {
	if ( 'nelio_form' !== get_post_type() ) {
		return $title;
	}//end if

	if ( ! is_preview() ) {
		return $title;
	}//end if

	$title = empty( $title )
		? _x( 'Form Preview', 'text', 'nelio-forms' )
		/* translators: %s - form title. */
		: sprintf( _x( '%s – Preview', 'text', 'nelio-forms' ), $title );
	return esc_html( $title );
}//end the_form_title()
add_filter( 'the_title', __NAMESPACE__ . '\the_form_title' );

function the_form_content( $content ) {
	if ( 'nelio_form' !== get_post_type() ) {
		return $content;
	}//end if

	$form_id = get_the_ID();
	$content = '';

	if ( is_preview() ) {
		$content .= '<p>';
		$content .= esc_html_x( 'This is a preview of your form.', 'text', 'nelio-forms' );
		$content .= '</p>';
	}//end if

	$content .= do_blocks( "<!-- wp:nelio-forms/form {\"ref\":{$form_id}} /-->" );

	return $content;
}//end the_form_content()
add_filter( 'the_content', __NAMESPACE__ . '\the_form_content' );

function disable_robots( $robots ) {
	return is_singular( 'nelio_form' )
		? array(
			'noindex'  => true,
			'nofollow' => true,
		)
		: $robots;
}//end disable_robots()
add_filter( 'wp_robots', __NAMESPACE__ . '\disable_robots', 999999 );

function get_icon() {
	$icon = nelio_forms_path() . '/includes/icon.svg';
	if ( ! file_exists( $icon ) ) {
		return 'dashicons-forms';
	}//end if
	return 'data:image/svg+xml;base64,' . base64_encode( file_get_contents( $icon ) ); // phpcs:ignore
}//end get_icon()

function get_new_form_template() {
	// TODO: Any change made here must be replicated in: src/blocks/form/defaults.ts.
	return array(
		array(
			'nelio-forms/text',
			array(
				'disabled' => false,
				'id'       => 'text-1',
				'label'    => '',
				'readOnly' => false,
				'required' => true,
				'type'     => 'text',
			),
		),
		array(
			'core/buttons',
			array(
				'lock' => array(
					'remove' => true,
					'move'   => true,
				),
			),
			array(
				array(
					'core/button',
					array(
						'text'       => _x( 'Submit', 'command', 'nelio-forms' ),
						'nfIsSubmit' => true,
						'lock'       => array(
							'remove' => true,
						),
					),
				),
			),
		),
	);
}//end get_new_form_template()
