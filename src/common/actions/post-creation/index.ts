/**
 * WordPress dependencies
 */
import { _x } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { PremiumActionTypeDefinition } from '@nelio/forms/types';

const action: PremiumActionTypeDefinition = {
	isPremium: true as const,
	isUnique: false,
	type: 'post-creation',
	label: _x( 'Content creation', 'text', 'nelio-forms' ),
	icon: 'admin-post',
	canCurrentUserUse: ( select ) =>
		!! select( 'core' )
			.getPostTypes( { per_page: -1 } )
			?.filter( ( p ) =>
				select( 'core' ).canUser( 'create', p.rest_base, '' )
			).length,
};

export default action;
