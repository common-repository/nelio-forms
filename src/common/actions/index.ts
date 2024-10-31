/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * External dependencies
 */
import { isPremium } from '@nelio/forms/utils';
import type {
	ActionTypeDefinition,
	ActionType,
	PremiumEditComponent,
} from '@nelio/forms/types';

/**
 * Internal dependencies
 */
import cookieCreation from './cookie-creation';
import emailNotification from './email-notification';
import postCreation from './post-creation';
import userRegistration from './user-registration';
import mailchimpIntegration from './mailchimp-integration';
import zapierIntegration from './zapier-integration';

const actionTypes: ReadonlyArray< ActionTypeDefinition > = [
	cookieCreation,
	emailNotification,
	mailchimpIntegration,
	postCreation,
	userRegistration,
	zapierIntegration,
];

export const useActionTypes = (): ReadonlyArray< ActionType< unknown > > =>
	useSelect( ( select ) => {
		return actionTypes.map(
			( { canCurrentUserUse, ...at } ): ActionType< unknown > => {
				const isDisabled =
					( at.isPremium && ! isPremium() ) ||
					( !! canCurrentUserUse && ! canCurrentUserUse( select ) );
				if ( at.isPremium ) {
					const edit = applyFilters(
						`nelio_forms.get_action_${ at.type }_edit_component`,
						() => null
					) as PremiumEditComponent< unknown >;
					const defaults = applyFilters(
						`nelio_forms.get_action_${ at.type }_defaults`,
						{}
					);
					return {
						...at,
						edit,
						isDisabled,
						defaults,
					};
				} //end if
				return { ...at, isDisabled };
			}
		);
	} );

export const useActionType = < T >(
	type: string
): ActionType< T > | undefined =>
	useActionTypes().find( ( a ) => a.type === type ) as ActionType< T >;
