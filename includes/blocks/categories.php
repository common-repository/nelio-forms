<?php

namespace Nelio_Forms\Blocks;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function register_block_categories( $categories ) {
	return array_merge(
		$categories,
		array(
			array(
				'slug'  => 'nelio-forms',
				'title' => _x( 'Nelio Forms', 'text', 'nelio-forms' ),
				'icon'  => null,
			),
		)
	);
}//end register_block_categories()
add_action( 'block_categories_all', __NAMESPACE__ . '\register_block_categories', 10, 2 );
