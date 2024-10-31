<?php

namespace Nelio_Forms\Compat;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function sitemap_exclude_post_type( $excluded, $post_type ) {
	return $excluded || 'nelio_form' === $post_type;
}//end sitemap_exclude_post_type()
add_filter( 'wpseo_sitemap_exclude_post_type', __NAMESPACE__ . '\sitemap_exclude_post_type', 10, 2 );

function remove_wp_seo_meta_box() {
	remove_meta_box( 'wpseo_meta', 'nelio_form', 'normal' );
}//end remove_wp_seo_meta_box()
add_action( 'add_meta_boxes', __NAMESPACE__ . '\remove_wp_seo_meta_box', 100 );
