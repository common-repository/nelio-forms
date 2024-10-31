import { addValidator, getErrorMessage } from '@nelio/forms/validation';

function validateGroup( errors: ReadonlyArray< string >, el: HTMLElement ) {
	if ( ! el.classList.contains( 'nelio-forms-field__value--required' ) ) {
		return errors;
	} //end if

	if (
		el.querySelectorAll( 'input.nelio-forms-field__item-value:checked' )
			.length === 0
	) {
		errors = [ ...errors, getErrorMessage( 'generic', 'required' ) ];
	} //end if

	return errors;
} //end validate()
addValidator( 'radio-group', validateGroup );
