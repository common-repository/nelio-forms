import { addValidator, getErrorMessage } from '@nelio/forms/validation';
import { domReady } from '@nelio/forms/dom';

function validate( errors: ReadonlyArray< string >, el: HTMLInputElement ) {
	if (
		el.value.length !== 0 &&
		! /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test( el.value )
	) {
		errors = [ ...errors, getErrorMessage( el.type, 'invalid' ) ];
	} //end if

	return errors;
} //end validate()
addValidator( 'number', validate );
addValidator( 'number-slider', validate );

domReady( () => {
	Array.from(
		document.querySelectorAll( '.nelio-forms-field__value-output-numeric' )
	).forEach(
		( el: HTMLSpanElement ) =>
			( el.innerHTML = Number( el.innerHTML ).toLocaleString() )
	);
	Array.from(
		document.querySelectorAll( '.nelio-forms-form input[type=range]' )
	).forEach( ( el: HTMLInputElement ) =>
		el.addEventListener( 'input', (): void => {
			const value = el.value;
			if ( ! value ) {
				return;
			} //end if

			const output = el.parentElement?.querySelector(
				'.nelio-forms-field__value-output-numeric'
			);
			if ( ! output ) {
				return;
			} //end if
			output.innerHTML = Number( value ).toLocaleString();
		} )
	);
} );
