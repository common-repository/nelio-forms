/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { TextControl } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { TextFieldControl } from '@nelio/forms/components';
import type { ActionEditProps } from '@nelio/forms/types';

/**
 * Internal dependencies
 */
import type { EmailNotification } from './types';

const Edit = ( props: ActionEditProps< EmailNotification > ): JSX.Element => {
	const { name, setName, attributes, setAttributes } = props;
	const { to, from, replyTo, subject, message } = attributes;
	return (
		<>
			<TextControl
				value={ name }
				label={ _x( 'Action name', 'text', 'nelio-forms' ) }
				onChange={ setName }
			/>
			<TextFieldControl
				type="email"
				value={ to }
				label={ _x( 'Send To Email Address', 'text', 'nelio-forms' ) }
				onChange={ ( value ) => setAttributes( { to: value } ) }
			/>
			<TextFieldControl
				type="email"
				value={ from }
				label={ _x( 'From Email Address', 'text', 'nelio-forms' ) }
				onChange={ ( value ) => setAttributes( { from: value } ) }
			/>
			<TextFieldControl
				type="email"
				value={ replyTo }
				label={ _x( 'Reply-To Email Address', 'text', 'nelio-forms' ) }
				onChange={ ( value ) => setAttributes( { replyTo: value } ) }
			/>
			<TextFieldControl
				value={ subject }
				label={ _x( 'Email Subject', 'text', 'nelio-forms' ) }
				onChange={ ( value ) => setAttributes( { subject: value } ) }
			/>
			<TextFieldControl
				value={ message }
				label={ _x( 'Email Message', 'text', 'nelio-forms' ) }
				isMultiline={ true }
				onChange={ ( value ) => setAttributes( { message: value } ) }
			/>
		</>
	);
};

export default Edit;
