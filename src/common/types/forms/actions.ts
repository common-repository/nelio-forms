/**
 * WordPress dependenciens
 */
import type { select } from '@wordpress/data';

export type ActionTypeDefinition =
	| RegularActionTypeDefinition< unknown >
	| PremiumActionTypeDefinition;

export type RegularActionTypeDefinition< A > = {
	readonly isPremium: false;
	readonly isUnique: boolean;
	readonly type: string;
	readonly label: string;
	readonly icon: string;
	readonly defaults: A;
	readonly canCurrentUserUse?: ( s: typeof select ) => boolean;
	readonly edit: ( props: ActionEditProps< A > ) => JSX.Element | null;
};

export type PremiumActionTypeDefinition = {
	readonly isPremium: true;
	readonly isUnique: boolean;
	readonly type: string;
	readonly label: string;
	readonly icon: string | JSX.Element;
	readonly canCurrentUserUse?: ( s: typeof select ) => boolean;
};

export type ActionType< A > = {
	readonly isPremium: boolean;
	readonly isUnique: boolean;
	readonly type: string;
	readonly label: string;
	readonly icon: string | JSX.Element;
	readonly defaults: A;
	readonly isDisabled: boolean;
	readonly edit: ( props: ActionEditProps< A > ) => JSX.Element | null;
}; //PremiumActionType | RegularActionType< unknown >

export type PremiumEditComponent< A > = (
	props: ActionEditProps< A >
) => JSX.Element | null;

export type ActionEditProps< A > = ActionInstance< A > & {
	readonly formId: number;
	readonly setName: ( name: string ) => void;
	readonly setAttributes: ( attributes: Partial< A > ) => void;
};

export type ActionInstance< A = unknown > = {
	readonly type: string;
	readonly name: string;
	readonly id: string;
	readonly isActive: boolean;
	readonly attributes: A;
};
