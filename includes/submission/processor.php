<?php

namespace Nelio_Forms\Submission;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function process_submission( $entry ) {
	$form_id = absint( $entry['nelio_forms']['id'] );
	$form    = get_form( $form_id );
	if ( ! $form || ( 'publish' !== $form['status'] && ! is_preview() ) ) {
		/**
		 * Filters the error message shown to the user when the submitted form couldn’t be found.
		 *
		 * @param string $message error message.
		 *
		 * @since 1.0.0
		 */
		$message = apply_filters( 'nelio_forms_invalid_form_message', _x( 'Invalid form.', 'text', 'nelio-forms' ) );
		return array( 'message' => $message );
	}//end if

	// phpcs:ignore
	if ( ! empty( $_POST['nelio_forms']['fields']['hp'] ) ) {
		/**
		 * Filters the error message shown to the user when the honeypot field is not empty.
		 *
		 * @param string $message error message.
		 *
		 * @since 1.0.3
		 */
		$message = apply_filters( 'nelio_forms_honeypot_detected_message', _x( 'Something is stuck in the honey.', 'text', 'nelio-forms' ) );
		return array( 'message' => $message );
	}//end if

	$validation_errors = get_validation_errors( $form, $entry );
	if ( ! empty( $validation_errors ) ) {
		/**
		 * Filters the error message shown to the user when the submitted form contains validation errors.
		 *
		 * @param string $message error message.
		 *
		 * @since 1.0.0
		 */
		$message = apply_filters( 'nelio_forms_submission_error_message', _x( 'Form has not been submitted, please see the errors above.', 'text', 'nelio-forms' ) );
		return array(
			'message' => $message,
			'errors'  => $validation_errors,
		);
	}//end if

	$sanitized_fields = get_sanitized_fields( $form, $entry );

	/**
	 * Filters whether the submitted form contains spam.
	 *
	 * @param bool  $is_spam whether the submission is spam or not.
	 * @param array $fields  sanitized entry field values/properties.
	 * @param array $form    form settings/data.
	 * @param array $entry   original `$_POST` global.
	 *
	 * @since 1.0.4
	 */
	$is_spam = apply_filters( 'nelio_forms_check_spam', false, $sanitized_fields, $form, $entry );

	/**
	 * Fires after the form entry is ready.
	 *
	 * This hook is used by Nelio Forms to trigger entry-related actions.
	 *
	 * @param array   $fields  sanitized entry field values/properties.
	 * @param array   $form    form settings/data.
	 * @param array   $entry   original `$_POST` global.
	 * @param boolean $is_spam whether the entry was flagged as spam.
	 *
	 * @since 1.0.6
	 */
	do_action( 'nelio_forms_pre_process', $sanitized_fields, $form, $entry, $is_spam );

	if ( $is_spam ) {
		/**
		 * Filters the error message shown to the user when the submission is flagged as spam.
		 *
		 * @param string $message error message.
		 *
		 * @since 1.0.4
		 */
		$message = apply_filters( 'nelio_forms_spam_detected_message', _x( 'The submitted data was flagged as spam.', 'text', 'nelio-forms' ) );
		return array( 'message' => $message );
	}//end if

	/**
	 * Fires after the form has been validated.
	 *
	 * This hook is used by Nelio Forms to trigger related conversion actions.
	 *
	 * @param array $fields sanitized entry field values/properties.
	 * @param array $form   form settings/data.
	 * @param array $entry  original `$_POST` global.
	 *
	 * @since 1.0.0
	 */
	do_action( 'nelio_forms_process', $sanitized_fields, $form, $entry );

	/**
	 * Fires after the form has been validated.
	 *
	 * This hook is used by Nelio Forms to trigger related conversion actions.
	 *
	 * @param array $fields sanitized entry field values/properties.
	 * @param array $form   form settings/data.
	 * @param array $entry  original `$_POST` global.
	 *
	 * @since 1.0.0
	 */
	do_action( "nelio_forms_process_{$form_id}", $sanitized_fields, $form, $entry );

	/**
	 * Fires after the form has been processed by Nelio Forms’ default actions.
	 *
	 * @param array $fields sanitized entry field values/properties.
	 * @param array $form   form settings/data.
	 * @param array $entry  original `$_POST` global.
	 *
	 * @since 1.0.0
	 */
	do_action( 'nelio_forms_process_complete', $sanitized_fields, $form, $entry );

	/**
	 * Fires after the form has been processed by Nelio Forms’ default actions.
	 *
	 * @param array $fields sanitized entry field values/properties.
	 * @param array $form   form settings/data.
	 * @param array $entry  original `$_POST` global.
	 *
	 * @since 1.0.0
	 */
	do_action( "nelio_forms_process_complete_{$form_id}", $sanitized_fields, $form, $entry );
}//end process_submission()

function get_validation_errors( $form, $entry ) {
	$validation_errors = array();

	foreach ( $form['fields'] as $field_properties ) {
		$field_id     = $field_properties['id'];
		$field_type   = $field_properties['type'];
		$field_submit = isset( $entry['nelio_forms']['fields'][ $field_id ] ) ? $entry['nelio_forms']['fields'][ $field_id ] : '';
		$errors       = array();

		/**
		 * Filters the list of errors (if any) found in a submitted field.
		 *
		 * Each “error” is a user-friendly string describing what’s amiss such as, for example, “This field is required.”
		 *
		 * @param array  $errors      list of errors found in a submitted field.
		 * @param string $value       submitted value or empty string if field was missing.
		 * @param array  $field_props field properties.
		 * @param array  $form        form settings/data.
		 * @param array  $entry       original `$_POST` global.
		 *
		 * @since 1.0.0
		 */
		$errors = apply_filters( 'nelio_forms_validate_field', $errors, $field_submit, $field_properties, $form, $entry );

		/**
		 * Filters the list of errors (if any) found in a submitted field of the given type.
		 *
		 * Each “error” is a user-friendly string describing what’s amiss such as, for example, “This field is required.”
		 *
		 * @param array  $errors      list of errors found in a submitted field.
		 * @param string $value       submitted value or empty string if field was missing.
		 * @param array  $field_props field properties.
		 * @param array  $form        form settings/data.
		 * @param array  $entry       original `$_POST` global.
		 *
		 * @since 1.0.0
		 */
		$errors = apply_filters( "nelio_forms_validate_{$field_type}_field", $errors, $field_submit, $field_properties, $form, $entry );

		if ( ! empty( $errors ) ) {
			$validation_errors[ $field_id ] = $errors;
		}//end if
	}//end foreach

	return $validation_errors;
}//end get_validation_errors()

function get_sanitized_fields( $form, $entry ) {
	$sanitized_fields = array();

	foreach ( $form['fields'] as $field_properties ) {

		$field_id     = $field_properties['id'];
		$field_type   = $field_properties['type'];
		$field_submit = isset( $entry['nelio_forms']['fields'][ $field_id ] ) ? $entry['nelio_forms']['fields'][ $field_id ] : '';

		/**
		 * Sanitizes a submitted field of the given type.
		 *
		 * @param any   $value       submitted value or empty string if field was missing.
		 * @param array $field_props field properties.
		 * @param array $form        form settings/data.
		 * @param array $entry       original `$_POST` global.
		 *
		 * @since 1.0.0
		 */
		$field_value = apply_filters( "nelio_forms_sanitize_{$field_type}_field", $field_submit, $field_properties, $form, $entry );

		$sanitized_fields[] = array(
			'id'    => $field_id,
			'value' => $field_value,
			'type'  => $field_type,
			'label' => $field_properties['label'],
		);
	}//end foreach

	return $sanitized_fields;
}//end get_sanitized_fields()

function get_form( $form_id ) {
	$form = get_post( $form_id );
	if ( ! $form || 'nelio_form' !== $form->post_type ) {
		return false;
	}//end if

	$fields  = get_form_fields( $form );
	$actions = get_form_actions( $form_id );

	return array(
		'id'       => $form->ID,
		'status'   => $form->post_status,
		'fields'   => $fields,
		'settings' => array(
			'title'   => $form->post_title,
			'actions' => $actions,
			'spam'    => get_post_meta( $form_id, '_nelio_forms_spam', true ),
		),
	);
}//end get_form()

function get_form_fields( $form ) {
	$queue  = parse_blocks( $form->post_content );
	$blocks = array();
	while ( count( $queue ) > 0 ) { // phpcs:ignore
		$block = &$queue[0];
		array_shift( $queue );
		$blocks[] = &$block;

		if ( ! empty( $block['innerBlocks'] ) ) {
			foreach ( $block['innerBlocks'] as &$inner_block ) {
				$queue[] = &$inner_block;
			}//end foreach
		}//end if
	}//end while

	$types    = \Nelio_Forms\Blocks\get_types();
	$defaults = array_map(
		function( $type ) {
			$attrs = array();
			foreach ( $type['attributes'] as $name => $meta ) {
				$attrs[ $name ] = isset( $meta['default'] ) ? $meta['default'] : null;
			}//end foreach
			return wp_parse_args(
				$attrs,
				array(
					'type'  => $type['name'],
					'label' => $type['title'],
				)
			);
		},
		$types
	);
	$defaults = array_combine( array_keys( $types ), $defaults );

	$fields = array_map(
		function( $block ) use ( $defaults ) {
			if ( ! isset( $defaults[ $block['blockName'] ] ) ) {
				return false;
			}//end if
			return wp_parse_args( $block['attrs'], $defaults[ $block['blockName'] ] );
		},
		$blocks
	);
	return array_values( array_filter( $fields ) );
}//end get_form_fields()

function get_form_actions( $form_id ) {
	$actions = get_post_meta( $form_id, '_nelio_forms_actions', true );
	return array_values( array_filter( $actions, 'is_array' ) );
}//end get_form_actions()
