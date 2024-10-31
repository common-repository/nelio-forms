import {
	clearFormErrors,
	closestByClass,
	domReady,
	setFieldErrors,
} from '@nelio/forms/dom';

const initForm = ( form: HTMLFormElement ) => {
	addMissingFieldIds( form );

	form.querySelector( '.nelio-forms-submit' )?.addEventListener(
		'auxclick',
		( event: MouseEvent ) => 1 === event.button && event.preventDefault()
	);

	form.querySelector( '.nelio-forms-submit' )?.addEventListener(
		'click',
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		async ( event ) => {
			const submitButton = event.target as HTMLElement;
			if ( submitButton.dataset.isNelioFormProcessed ) {
				return;
			} //end if
			event.preventDefault();

			if ( form.classList.contains( '.nelio-forms-form--submitting' ) ) {
				return;
			} //end if
			setFormSubmitting( form, submitButton );
			const response = await submitForm( form );
			processResponse( form, response );
			setFormReady( form, submitButton );

			if ( response.success ) {
				submitButton.dataset.isNelioFormProcessed = 'true';
				if ( ! response.data.redirection ) {
					submitButton.click();
				} //end if
				delete submitButton.dataset.isNelioFormProcessed;
			} //end if
		}
	);
};

type SubmissionResponse =
	| {
			readonly success: true;
			readonly data: {
				readonly message: string;
				readonly redirection?: string;
			};
	  }
	| {
			readonly success: false;
			readonly data: {
				readonly message: string;
				readonly errors?: Record< string, ReadonlyArray< string > >;
			};
	  };
async function submitForm(
	form: HTMLFormElement
): Promise< SubmissionResponse > {
	const response = await fetch(
		form.getAttribute( 'action' ) ?? window.location.href,
		{
			method: form.getAttribute( 'method' ) ?? 'POST',
			body: new FormData( form ),
		}
	);

	if ( ! response.ok ) {
		return {
			success: false,
			data: {
				message: `An error has occured: ${ response.status }`,
			},
		};
	} //end if

	return ( await response.json() ) as SubmissionResponse;
} //end submitForm

const processResponse = (
	form: HTMLFormElement,
	response: SubmissionResponse
) => {
	setResponseInWrapper( form, response );
	setErrorsInFields( form, response );
	maybeHideForm( form, response );
	maybeRedirect( response );
};

const maybeHideForm = (
	form: HTMLFormElement,
	response: SubmissionResponse
) => {
	if ( ! response.success ) {
		return;
	} //end if

	if ( 'true' !== form.dataset.hideForm ) {
		return;
	} //end if

	form.classList.add( 'nelio-forms-form--hidden' );
};

const maybeRedirect = ( response: SubmissionResponse ) => {
	if ( ! response.success ) {
		return;
	} //end if

	if ( response.data.redirection ) {
		window.location.href = response.data.redirection;
	} //end if
};

const setResponseInWrapper = (
	form: HTMLFormElement,
	response: SubmissionResponse
) => {
	const responseWrapper = getFormResponseWrapper( form );
	responseWrapper.classList.toggle(
		'nelio-forms__response--success',
		response.success
	);
	responseWrapper.classList.toggle(
		'nelio-forms__response--fail',
		! response.success
	);
	responseWrapper.textContent = response.data.message;
};

const setErrorsInFields = (
	form: HTMLFormElement,
	response: SubmissionResponse
) => {
	if ( response.success ) {
		return;
	} //end if

	const errors = response.data.errors;
	if ( ! errors ) {
		return;
	} //end if

	Object.keys( errors ).forEach( ( fieldId ) =>
		setFieldErrors( form, fieldId, errors[ fieldId ] )
	);

	const firstFailedField = form.querySelector(
		'.nelio-forms-field__error-label > div'
	)?.parentElement?.parentElement;
	if ( firstFailedField ) {
		if ( ! isElementInViewport( firstFailedField ) ) {
			firstFailedField.scrollIntoView( {
				behavior: 'smooth',
			} );
		} //end if
		form.querySelector(
			'.nelio-forms-field__error-label > div'
		)?.parentElement?.focus( { preventScroll: true } );
	} //end if
};

const isElementInViewport = ( el: HTMLElement ) => {
	const rect = el.getBoundingClientRect();

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <=
			( window.innerHeight || document.documentElement.clientHeight ) &&
		rect.right <=
			( window.innerWidth || document.documentElement.clientWidth )
	);
};

const getFormResponseWrapper = ( form: HTMLFormElement ): HTMLElement =>
	form.querySelector( `.nelio-forms__response` ) ||
	createFormResponseWrapper( form );

const createFormResponseWrapper = ( form: HTMLFormElement ): HTMLElement => {
	const responseWrapper = document.createElement( 'div' );
	responseWrapper.classList.add( 'nelio-forms__response' );
	form.appendChild( responseWrapper );
	return responseWrapper;
};

const setFormSubmitting = (
	form: HTMLFormElement,
	submitButton: HTMLElement
) => {
	const submittingLabel = form.dataset.submitProcessingLabel;
	if ( submittingLabel ) {
		submitButton.setAttribute( 'data-label', submitButton.innerText );
		submitButton.innerHTML = submittingLabel;
	} //end if

	clearFormErrors( form );
	const responseWrapper = getFormResponseWrapper( form );
	responseWrapper.parentNode?.removeChild( responseWrapper );
	form.classList.add( 'nelio-forms-form--submitting' );
	form.querySelector( '.nelio-forms-submit' )?.classList.add(
		'nelio-forms-submit--disabled'
	);
};

const setFormReady = ( form: HTMLFormElement, submitButton: HTMLElement ) => {
	const submitLabel = submitButton.dataset.label;
	if ( submitLabel ) {
		submitButton.innerHTML = submitLabel;
	} //end if

	form.querySelector( '.nelio-forms-submit' )?.classList.remove(
		'nelio-forms-submit--disabled'
	);
	form.classList.remove( 'nelio-forms-form--submitting' );
};

const isForm = ( el: HTMLElement ): el is HTMLFormElement =>
	'FORM' === el.nodeName;

const addMissingFieldIds = ( form: HTMLFormElement ): void =>
	Array.from(
		form.querySelectorAll< HTMLElement >(
			'.nelio-forms-form *[name]:not([id])'
		)
	).forEach( ( field ) => {
		const name = field.getAttribute( 'name' ) ?? '';
		const id = name.replace( 'nelio_forms[fields][', '' ).split( ']' )[ 0 ];
		if ( ! id ) {
			return;
		} //end if

		const fullId = `${ form.id }__${ id }`;
		field.id = fullId;

		const wrapper = closestByClass( 'nelio-forms-field', field );
		Array.from(
			wrapper?.querySelectorAll( 'label:not([for])' ) ?? []
		).forEach( ( label ) => label.setAttribute( 'for', fullId ) );
	} );

// ======
//  INIT
// ======

domReady( () =>
	Array.from( document.querySelectorAll( '.nelio-forms-form' ) )
		.filter( isForm )
		.forEach( initForm )
);
