<?php

namespace Nelio_Forms\Actions;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function parse_action( $action ) {
	$default_attributes = array(
		'to'      => '{admin_email}',
		'from'    => '{admin_email}',
		'replyTo' => '',
		'subject' => _x( 'New Email Notification', 'text', 'nelio-forms' ),
		'message' => '{all_fields}',
	);

	$name = $action['name'];
	$name = ! empty( $name ) ? $name : _x( 'Email notification', 'text', 'nelio-forms' );

	return array_merge(
		$action,
		array(
			'name'       => $name,
			'attributes' => wp_parse_args(
				$action['attributes'],
				$default_attributes
			),
		)
	);
}//end parse_action()
add_filter( 'nelio_forms_parse_email-notification_action', __NAMESPACE__ . '\parse_action' );

function process_email_notification( $attributes, $fields, $form, $entry ) {

	$from     = nelio_forms_process_field( $attributes['from'], $fields, $form );
	$to       = nelio_forms_process_field( $attributes['to'], $fields, $form );
	$reply_to = nelio_forms_process_field( $attributes['replyTo'], $fields, $form );
	$subject  = nelio_forms_process_field( $attributes['subject'], $fields, $form );
	$message  = nelio_forms_process_field( $attributes['message'], $fields, $form );

	$headers[] = 'Content-Type: text/plain; charset=UTF-8';
	$headers[] = "From: {$from}";
	$headers[] = "Reply-To: {$reply_to}";

	wp_mail( $to, $subject, $message, $headers ); // phpcs:ignore

}//end process_email_notification()
add_action( 'nelio_forms_process_email-notification_action', __NAMESPACE__ . '\process_email_notification', 10, 4 );
