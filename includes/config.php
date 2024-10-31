<?php

namespace Nelio_Forms\Config;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

function allowed_form_block_types() {
	/**
	 * Filters the block types that might be included in a form.
	 *
	 * @param array $types block types that might be included in a form.
	 *
	 * @since 1.0.0
	 */
	return apply_filters(
		'nelio_forms_allowed_form_block_types',
		array(
			'core/column',
			'core/columns',
			'core/button',
			'core/buttons',
			'core/paragraph',
			'nelio-forms/checkbox',
			'nelio-forms/checkbox-group',
			'nelio-forms/datetime',
			'nelio-forms/number',
			'nelio-forms/radio-group',
			'nelio-forms/select',
			'nelio-forms/text',
			'nelio-forms/textarea',
		)
	);
}//end allowed_form_block_types()
