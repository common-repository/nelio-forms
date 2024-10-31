<?php

namespace Nelio_Forms\Form_Capabilities;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

register_activation_hook( 'nelio-forms/nelio-forms.php', __NAMESPACE__ . '\plugin_activation' );
register_deactivation_hook( 'nelio-forms/nelio-forms.php', __NAMESPACE__ . '\plugin_deactivation' );
add_action( 'wpmu_new_blog', __NAMESPACE__ . '\new_blog_creation' );

function plugin_activation( $network_wide ) {
	if ( is_multisite() && $network_wide ) {
		foreach ( get_sites( array( 'fields' => 'ids' ) ) as $blog_id ) {
			switch_to_blog( $blog_id );
			add_capabilities();
			restore_current_blog();
		}//end foreach
	} else {
		add_capabilities();
	}//end if
}//end plugin_activation()

function plugin_deactivation( $network_wide ) {
	if ( is_multisite() && $network_wide ) {
		foreach ( get_sites( array( 'fields' => 'ids' ) ) as $blog_id ) {
			switch_to_blog( $blog_id );
			remove_capabilities();
			restore_current_blog();
		}//end foreach
	} else {
		remove_capabilities();
	}//end if
}//end plugin_deactivation()

function new_blog_creation( $blog_id ) {
	if ( is_plugin_active_for_network( 'nelio-forms/nelio-forms.php' ) ) {
		switch_to_blog( $blog_id );
		add_capabilities();
		restore_current_blog();
	}//end if
}//end new_blog_creation()

function add_capabilities() {
	$role = get_role( 'administrator' );
	if ( $role ) {
		foreach ( get_editor_caps() as $cap ) {
			$role->add_cap( $cap );
		}//end foreach
	}//end if

	$role = get_role( 'editor' );
	if ( $role ) {
		foreach ( get_editor_caps() as $cap ) {
			$role->add_cap( $cap );
		}//end foreach
	}//end if

	$role = get_role( 'author' );
	if ( $role ) {
		foreach ( get_author_caps() as $cap ) {
			$role->add_cap( $cap );
		}//end foreach
	}//end if

	$role = get_role( 'contributor' );
	if ( $role ) {
		foreach ( get_contributor_caps() as $cap ) {
			$role->add_cap( $cap );
		}//end foreach
	}//end if
}//end add_capabilities()

function remove_capabilities() {
	$role = get_role( 'administrator' );
	if ( $role ) {
		foreach ( get_editor_caps() as $cap ) {
			$role->remove_cap( $cap );
		}//end foreach
	}//end if

	$role = get_role( 'editor' );
	if ( $role ) {
		foreach ( get_editor_caps() as $cap ) {
			$role->remove_cap( $cap );
		}//end foreach
	}//end if

	$role = get_role( 'author' );
	if ( $role ) {
		foreach ( get_author_caps() as $cap ) {
			$role->remove_cap( $cap );
		}//end foreach
	}//end if

	$role = get_role( 'contributor' );
	if ( $role ) {
		foreach ( get_contributor_caps() as $cap ) {
			$role->remove_cap( $cap );
		}//end foreach
	}//end if
}//end remove_capabilities()

function get_contributor_caps() {
	return array(
		'edit_nelio_forms',
		'delete_nelio_forms',
	);
}//end get_contributor_caps()

function get_author_caps() {
	return array_merge(
		get_contributor_caps(),
		array(
			'edit_nelio_forms',
			'delete_nelio_forms',
			'delete_published_nelio_forms',
			'publish_nelio_forms',
			'edit_published_nelio_forms',
		)
	);
}//end get_author_caps()

function get_editor_caps() {
	return array_merge(
		get_author_caps(),
		array(
			'edit_others_nelio_forms',
			'delete_others_nelio_forms',
			'delete_private_nelio_forms',
			'edit_private_nelio_forms',
			'read_private_nelio_forms',
		)
	);
}//end get_editor_caps()
