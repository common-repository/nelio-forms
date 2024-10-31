import { addValidator, getErrorMessage } from '@nelio/forms/validation';
import { domReady } from '@nelio/forms/dom';

const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9][a-z0-9.-]*\.[a-z]{2,63}$/i;
const URL_REGEX = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

addValidator( 'tel' );
addValidator( 'text' );

function validateEmail(
	errors: ReadonlyArray< string >,
	el: HTMLInputElement
) {
	if ( el.value.length !== 0 && ! EMAIL_REGEX.test( el.value ) ) {
		errors = [ ...errors, getErrorMessage( 'email', 'invalid' ) ];
	} //end if

	return errors;
} //end validate()
addValidator( 'email', validateEmail );

function validateUrl( errors: ReadonlyArray< string >, el: HTMLInputElement ) {
	if ( el.value.length !== 0 && ! URL_REGEX.test( el.value ) ) {
		errors = [ ...errors, getErrorMessage( 'url', 'invalid' ) ];
	} //end if

	return errors;
} //end validate()
addValidator( 'url', validateUrl );

function validateConfirmationPassword(
	errors: ReadonlyArray< string >,
	el: HTMLInputElement
) {
	if ( el.dataset.matchField ) {
		const matchField = document.getElementById(
			el.dataset.matchField
		) as HTMLInputElement | null;
		if (
			el.value.length !== 0 &&
			matchField?.value.length !== 0 &&
			el.value !== matchField?.value
		) {
			errors = [
				...errors,
				getErrorMessage( 'password', 'do-not-match' ),
			];
		}
	}

	return errors;
} //end validateConfirmationPassword()
addValidator( 'password', validateConfirmationPassword );

// Prepend URL field contents with https:// if user input doesn't contain a
// schema.
domReady( () =>
	Array.from(
		document.querySelectorAll( '.nelio-forms-form input[type=url]' )
	).forEach( ( el: HTMLInputElement ) =>
		el.addEventListener( 'change', (): void => {
			const url = el.value;
			if ( ! url ) {
				return;
			} //end if
			if (
				url.substring( 0, 7 ) !== 'http://' &&
				url.substring( 0, 8 ) !== 'https://'
			) {
				el.value = 'https://' + url;
			}
		} )
	)
);
