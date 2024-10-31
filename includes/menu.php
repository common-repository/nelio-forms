<?php

namespace Nelio_Forms\Menu;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function register_submenus() {
	if ( ! current_user_can( 'edit_others_nelio_forms' ) ) {
		return;
	}//end if

	global $submenu;
	$menu_slug = 'edit.php?post_type=nelio_form';

	if ( ! is_plugin_active( 'nelio-forms-premium/nelio-forms-premium.php' ) ) {
		// phpcs:ignore
		$submenu[ $menu_slug ][20] = array(
			_x( 'Premium', 'text', 'nelio-forms' ),
			'edit_others_nelio_forms',
			add_query_arg(
				array(
					'utm_source'   => 'nelio-forms',
					'utm_medium'   => 'plugin',
					'utm_campaign' => 'premium',
					'utm_content'  => 'plugin-submenu',
				),
				__( 'https://neliosoftware.com/forms/', 'nelio-forms' )
			),
		);
	}//end if

	// phpcs:ignore
	$submenu[ $menu_slug ][30] = array(
		_x( 'Support', 'text', 'nelio-forms' ),
		'edit_others_nelio_forms',
		__( 'https://wordpress.org/support/plugin/nelio-forms/', 'nelio-forms' ),
	);
}//end register_submenus()
add_action( 'admin_menu', __NAMESPACE__ . '\register_submenus' );
