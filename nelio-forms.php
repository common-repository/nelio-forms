<?php
/**
 * Plugin Name: Nelio Forms
 * Plugin URI:  https://neliosoftware.com/forms/
 * Description: A plugin to create contact forms.
 *
 * Author:      Nelio Software
 * Author URI:  https://neliosoftware.com
 * Version:     1.0.23
 * Text Domain: nelio-forms
 *
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

define( 'NELIO_FORMS', true );

function nelio_forms_path() {
	return untrailingslashit( plugin_dir_path( __FILE__ ) );
}//end nelio_forms_path()

function nelio_forms_url() {
	return untrailingslashit( plugin_dir_url( __FILE__ ) );
}//end nelio_forms_url()

function nelio_forms_version() {
	$data = get_file_data( __FILE__, array( 'Version' ), 'plugin' );
	return $data[0];
}//end nelio_forms_version()

function nelio_forms_init() {
	require_once nelio_forms_path() . '/includes/utils.php';
	require_once nelio_forms_path() . '/includes/config.php';

	require_once nelio_forms_path() . '/includes/css.php';
	require_once nelio_forms_path() . '/includes/menu.php';
	require_once nelio_forms_path() . '/includes/form-editor.php';
	require_once nelio_forms_path() . '/includes/form-capabilities.php';
	require_once nelio_forms_path() . '/includes/forms.php';
	require_once nelio_forms_path() . '/includes/rest.php';

	require_once nelio_forms_path() . '/includes/compat/index.php';

	require_once nelio_forms_path() . '/includes/actions/index.php';
	require_once nelio_forms_path() . '/includes/blocks/index.php';
	require_once nelio_forms_path() . '/includes/fields/index.php';
	require_once nelio_forms_path() . '/includes/submission/index.php';
}//end nelio_forms_init()
nelio_forms_init();
