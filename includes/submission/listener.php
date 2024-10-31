<?php

namespace Nelio_Forms\Submission;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function listen() {
	// phpcs:ignore
	if ( ! isset( $_POST['nelio_forms'] ) ) {
		return;
	}//end if

	// phpcs:ignore
	if ( ! is_array( $_POST['nelio_forms'] ) ) {
		return;
	}//end if

	// phpcs:ignore
	if ( ! isset( $_POST['nelio_forms']['fields'] ) ) {
		return;
	}//end if

	// phpcs:ignore
	$form_id = ! empty( $_POST['nelio_forms']['id'] ) ? absint( $_POST['nelio_forms']['id'] ) : 0;
	if ( ! $form_id ) {
		return;
	}//end if

	// phpcs:ignore
	$errors = process_submission( $_POST );
	if ( ! empty( $errors ) ) {
		wp_send_json_error( $errors );
	}//end if

	$general_settings         = get_post_meta( $form_id, '_nelio_forms_general', true );
	$valid_submission_message = _x( 'Form submitted successfully.', 'text', 'nelio-forms' );
	if ( isset( $general_settings['onValidSubmission']['message'] ) ) {
		$valid_submission_message = $general_settings['onValidSubmission']['message'];
	}//end if

	/**
	 * Filters the successful submission message.
	 *
	 * @param string $message successful submission message.
	 *
	 * @since 1.0.0
	 */
	$message = apply_filters( 'nelio_forms_successful_submission_message', $valid_submission_message );

	$redirection_url = false;
	if ( isset( $general_settings['onValidSubmission']['redirection'] ) ) {
		$redirection_url = $general_settings['onValidSubmission']['redirection'];
	}//end if

	/**
	 * Filters the URL to redirect after successful submission.
	 *
	 * @param string $url URL to redirect after successful submission.
	 *
	 * @since 1.0.10
	 */
	$url = apply_filters( 'nelio_forms_successful_submission_redirection', $redirection_url );

	if ( empty( $url ) ) {
		wp_send_json_success( array( 'message' => $message ) );
	} else {
		wp_send_json_success(
			array(
				'message'     => $message,
				'redirection' => $url,
			)
		);
	}//end if
}//end listen()
add_action( 'wp', __NAMESPACE__ . '\listen' );
