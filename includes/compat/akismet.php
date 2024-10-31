<?php

namespace Nelio_Forms\Compat;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function check_spam( $is_spam, $sanitized_fields, $form, $entry ) {
	/**
	 * Short-circuits the spam check.
	 *
	 * @param bool  $skip whether to skip the spam check or not.
	 *
	 * @since 1.0.4
	 */
	$skip_spam_check = apply_filters( 'nelio_forms_skip_spam_check', false );
	if ( $skip_spam_check ) {
		return false;
	}//end if

	if ( ! akismet_is_available() ) {
		return $is_spam;
	}//end if

	$params = akismet_submitted_params( $sanitized_fields, $form );
	if ( ! $params ) {
		return false;
	}//end if

	$data = array(
		'comment_author'       => $params['name'],
		'comment_author_email' => $params['email'],
		'comment_author_url'   => $params['url'],
		'comment_content'      => $params['content'],
		'blog'                 => get_option( 'home' ),
		'blog_lang'            => get_locale(),
		'blog_charset'         => get_option( 'blog_charset' ),
		'user_ip'              => $_SERVER['REMOTE_ADDR'], // phpcs:ignore
		'user_agent'           => $_SERVER['HTTP_USER_AGENT'], // phpcs:ignore
		'referrer'             => $_SERVER['HTTP_REFERER'], // phpcs:ignore
		'comment_type'         => 'contact-form',
	);

	$permalink = get_permalink();
	if ( $permalink ) {
		$data['permalink'] = $permalink;
	}//end if

	$ignore = array( 'HTTP_COOKIE', 'HTTP_COOKIE2', 'PHP_AUTH_PW' );

	foreach ( $_SERVER as $key => $value ) {
		if ( ! in_array( $key, (array) $ignore, true ) ) {
			$data[ "$key" ] = $value;
		}//end if
	}//end foreach

	$data = apply_filters( 'nelio_forms_akismet_parameters', $data );
	if ( akismet_check( $data ) ) {
		$spam = true;
	} else {
		$spam = false;
	}//end if

	return $spam;

}//end check_spam()
add_filter( 'nelio_forms_check_spam', __NAMESPACE__ . '\check_spam', 10, 4 );

function akismet_is_available() {
	if ( is_callable( array( 'Akismet', 'get_api_key' ) ) ) {
		return (bool) \Akismet::get_api_key();
	}//end if

	return false;
}//end akismet_is_available()

/**
 * Returns an array of parameters based on the current form submission.
 *
 * @param array $fields sanitized entry field values/properties.
 * @param array $form   form settings/data.
 * @return mixed false if Akismet is not active on the contact form.
 */
function akismet_submitted_params( $fields, $form ) {
	$spam_settings = $form['settings']['spam'];
	if ( empty( $spam_settings ) || empty( $spam_settings['enabled'] ) ) {
		return false;
	}//end if

	$akismet = $spam_settings['akismet'];

	$params = array(
		'name'    => process_param( 'name', $akismet, $fields, $form ),
		'email'   => process_param( 'email', $akismet, $fields, $form ),
		'url'     => process_param( 'url', $akismet, $fields, $form ),
		'content' => process_param( 'content', $akismet, $fields, $form ),
	);

	$params = array_map( 'trim', $params );

	return $params;
}//end akismet_submitted_params()

function process_param( $name, $akismet, $fields, $form ) {
	if ( $akismet['custom'] ) {
		return nelio_forms_process_field( $akismet[ $name ], $fields, $form );
	}//end if

	$name_to_type = array(
		'name'    => 'text',
		'email'   => 'email',
		'url'     => 'url',
		'content' => 'textarea',
	);

	if ( ! isset( $name_to_type[ $name ] ) ) {
		return '';
	}//end if

	$type    = $name_to_type[ $name ];
	$matches = array_values( wp_list_filter( $fields, array( 'type' => $type ) ) );
	return empty( $matches ) ? '' : $matches[0]['value'];
}//end process_param()

function akismet_check( $data ) {
	$spam         = false;
	$query_string = build_query( $data );

	if ( is_callable( array( 'Akismet', 'http_post' ) ) ) {
		$response = \Akismet::http_post( $query_string, 'comment-check' );
	} else {
		return false;
	}//end if

	if ( 'true' === $response[1] ) {
		$spam = true;
	}//end if

	return $spam;
}//end akismet_check()

/**
 * Builds a URL-encoded query string.
 *
 * @see https://developer.wordpress.org/reference/functions/_http_build_query/
 *
 * @param array  $args URL query parameters.
 * @param string $key Optional. If specified, used to prefix key name.
 * @return string Query string.
 */
function build_query( $args, $key = '' ) {
	$sep = '&';
	$ret = array();

	foreach ( (array) $args as $k => $v ) {
		$k = rawurlencode( $k );

		if ( ! empty( $key ) ) {
			$k = $key . '%5B' . $k . '%5D';
		}//end if

		if ( null === $v ) {
			continue;
		} elseif ( false === $v ) {
			$v = '0';
		}//end if

		if ( is_array( $v ) || is_object( $v ) ) {
			array_push( $ret, build_query( $v, $k ) );
		} else {
			array_push( $ret, $k . '=' . rawurlencode( $v ) );
		}//end if
	}//end foreach

	return implode( $sep, $ret );
}//end build_query()
