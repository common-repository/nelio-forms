/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { trim } from 'lodash';

export const isPremium = (): boolean =>
	!! applyFilters( 'nelio_forms.is_premium', false );

export const makePremiumLabel = ( label: string ): string =>
	trim( `${ label } ${ premium() }` );

// =======
// HELPERS
// =======

const premium = () =>
	isPremium() ? '' : _x( '(premium)', 'text', 'nelio-forms' );
