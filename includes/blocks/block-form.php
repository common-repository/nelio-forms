<?php
/**
 * Server-side rendering of the `nelio-forms/form` block.
 *
 * @package WordPress
 */

namespace Nelio_Forms\Blocks\Form;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}//end if

/**
 * Renders the `nelio-forms/form` block on server.
 *
 * @param array $attributes The block attributes.
 *
 * @return string Rendered HTML of the referenced block.
 */
function render_block( $attributes ) {
	static $seen_refs = array();

	if ( empty( $attributes['ref'] ) ) {
		return '';
	}//end if

	$classnames = 'nelio-forms-form';
	if ( ! empty( $attributes['className'] ) ) {
		$classnames = implode(
			' ',
			array_map(
				'sanitize_html_class',
				explode( ' ', $classnames . ' ' . $attributes['className'] )
			)
		);
	}//end if

	$form = get_post( $attributes['ref'] );
	if ( ! $form || 'nelio_form' !== $form->post_type ) {
		return '';
	}//end if

	if ( isset( $seen_refs[ $attributes['ref'] ] ) ) {
		// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
		// is set in `wp_debug_mode()`.
		$is_debug = defined( 'WP_DEBUG' ) && WP_DEBUG &&
			defined( 'WP_DEBUG_DISPLAY' ) && WP_DEBUG_DISPLAY;

		return $is_debug ?
			// translators: Visible only in the front end, this warning takes the place of a faulty block.
			__( '[block rendering halted]' ) :
			'';
	}//end if

	if ( ! is_form_publicly_visible( $form ) && ! can_user_edit_form( $form->ID ) ) {
		return '';
	}//end if

	$seen_refs[ $attributes['ref'] ] = true;

	$result = do_blocks( $form->post_content );
	unset( $seen_refs[ $attributes['ref'] ] );

	wp_enqueue_script( 'nelio-forms-form-view-script' );
	wp_localize_script(
		'nelio-forms-form-view-script',
		'NelioFormsErrorMessages',
		/**
		* Filters the form error messages.
		*
		* @param array $errors Form error messages.
		*
		* @since 1.0.7
		*/
		apply_filters( 'nelio_forms_error_messages', array() )
	);

	$general_settings = get_post_meta( $form->ID, '_nelio_forms_general', true );

	ob_start();
	?>
	<form
		<?php printf( 'id="%s"', esc_attr( "nelio-forms-form-{$form->ID}" ) ); ?>
		<?php printf( 'data-formid="%s"', esc_attr( $form->ID ) ); ?>
		<?php
		if ( isset( $general_settings['submitProcessingLabel'] ) ) {
			printf( 'data-submit-processing-label="%s"', esc_attr( $general_settings['submitProcessingLabel'] ) );
		}//end if
		if ( isset( $general_settings['onValidSubmission']['type'] ) ) {
			printf( 'data-hide-form="%s"', esc_attr( 'hide-form' === $general_settings['onValidSubmission']['type'] ? 'true' : 'false' ) );
		}//end if
		?>
		<?php printf( 'class="%s"', esc_attr( $classnames ) ); ?>
		method="post"
		class="nelio-forms-form"
	>
		<noscript class="nelio-forms-error-noscript">
			<?php
			echo esc_html_x(
				'Please enable JavaScript in your browser to complete this form',
				'text',
				'nelio-forms'
			);
			?>
		</noscript>
		<?php echo $result; // phpcs:ignore ?>
		<?php printf( '<input type="hidden" name="nelio_forms[id]" value="%s">', esc_attr( $form->ID ) ); ?>
		<?php
		/**
		 * Fires after the form fields have been rendered.
		 *
		 * @param int $form_id  form id.
		 *
		 * @since 1.0.3
		 */
		do_action( 'nelio_forms_after_form_fields', $form->ID );
		?>
	</form>
	<?php
	$form = ob_get_contents();
	ob_end_clean();

	return $form;
}//end render_block()

/**
 * Registers the `nelio-forms/form` block.
 */
function register_block() {
	if ( ! function_exists( 'register_block_type' ) ) {
		return;
	}//end if

	if ( is_nelio_form_editor() ) {
		return;
	}//end if

	register_block_type(
		nelio_forms_path() . '/dist/blocks/form/block.json',
		array(
			'render_callback' => __NAMESPACE__ . '\render_block',
		)
	);
}//end register_block()
add_action( 'init', __NAMESPACE__ . '\register_block' );

function register_shortcode() {
	add_shortcode(
		'nelio-form',
		function ( $attrs ) {
			return do_blocks( "<!-- wp:nelio-forms/form {\"ref\":{$attrs['id']}} /-->" );
		}
	);
}//end register_shortcode()
add_action( 'init', __NAMESPACE__ . '\register_shortcode' );

function render_honeypot( $form_id ) {
	$label = esc_html_x( 'Please leave this field empty.', 'user', 'nelio-forms' );
	$html  = <<<END
		<div class="nelio-forms-field nelio-forms-field--hidden">
			<label class="nelio-forms-field__label nelio-forms-field__label--text" for="nelio-forms-form-{$form_id}__hp">$label</label>
			<input id="nelio-forms-form-{$form_id}__hp" type="text" class="nelio-forms-field__value nelio-forms-field__value--text" name="nelio_forms[fields][hp]" size="40" tabindex="-1" autocomplete="off">
		</div>
END;

	/**
	 * Filters the HTML of the honeypot form element.
	 *
	 * @param string $html honeypot form element.
	 *
	 * @since 1.0.3
	 */
	$html = apply_filters( 'nelio_forms_honeypot_html_output', $html );

	// phpcs:ignore
	echo $html;
}//end render_honeypot()
add_action( 'nelio_forms_after_form_fields', __NAMESPACE__ . '\render_honeypot' );

function is_form_publicly_visible( $form ) {
	return 'publish' === $form->post_status && empty( $form->post_password );
}//end is_form_publicly_visible()

function can_user_edit_form( $form_id ) {
	return current_user_can( 'edit_post', $form_id );
}//end can_user_edit_form()
