/**
 * WordPress dependencies
 */
import { registerBlockVariation, BlockConfiguration } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

addFilter(
	'blocks.registerBlockType',
	'nelio-forms/addIsSubmitAttribute',
	( settings: BlockConfiguration, name: string ): BlockConfiguration =>
		name !== 'core/button'
			? settings
			: {
					...settings,
					attributes: {
						...settings.attributes,
						nfIsSubmit: { type: 'boolean', default: false },
					},
			  }
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'nelio-forms/addIsSubmitClass',
	(
		props: Record< string, string >,
		_: unknown,
		attributes: Record< string, unknown >
	): Record< string, unknown > =>
		attributes.nfIsSubmit
			? {
					...props,
					className: classnames(
						props.className,
						'nelio-forms-submit'
					),
			  }
			: props
);

registerBlockVariation( 'core/button', {
	name: 'nelio-forms/submit',
	title: _x( 'Submit button', 'text', 'nelio-forms' ),
	description: _x(
		'Defines a form submission button.',
		'text',
		'nelio-forms'
	),
	scope: [],
	attributes: { nfIsSubmit: true },
	isActive: [ 'nfIsSubmit' ],
} );
