export function domReady( callback: () => void ): void {
	if ( typeof document === 'undefined' ) {
		return;
	} //end if

	if (
		document.readyState === 'complete' || // DOMContentLoaded + Images/Styles/etc loaded, so we call directly.
		document.readyState === 'interactive' // DOMContentLoaded fires at this point, so we call directly.
	) {
		return void callback();
	} //end if

	// DOMContentLoaded has not fired yet, delay callback until then.
	return document.addEventListener( 'DOMContentLoaded', callback );
} //end domReady()

export function setFieldErrors(
	form: HTMLFormElement,
	fieldId: string,
	errors: ReadonlyArray< string >
): void {
	const field = getField( form, fieldId );
	if ( ! field ) {
		return;
	} //end if

	const wrapper = getFieldErrorWrapper( form, fieldId );

	// Clear existing errors.
	field.classList.remove( 'nelio-forms-field__value--error' );
	wrapper.innerHTML = '';
	if ( ! errors.length ) {
		return;
	} //end if

	// Set new errors.
	field.classList.add( 'nelio-forms-field__value--error' );
	errors.forEach( ( err ) => {
		const div = document.createElement( 'div' );
		div.textContent = err;
		wrapper.appendChild( div );
	} );
} //end setFieldErrors()

export function clearFormErrors( form: HTMLFormElement ): void {
	Array.from(
		form.querySelectorAll( '.nelio-forms-field__error-label' )
	).forEach( ( el ) => el.parentNode?.removeChild( el ) );
} //end clearFormErrors()

export function closestByClass(
	className: string,
	el: HTMLElement
): HTMLElement | undefined {
	let p: HTMLElement | null = el.parentElement;
	while ( p ) {
		if ( p.classList.contains( className ) ) {
			return p;
		} //end if
		p = p.parentElement;
	} //end while
	return p || undefined;
} //end closestByClass()

// =======
// HELPERS
// =======

function getField(
	form: HTMLFormElement,
	fieldId: string
): HTMLElement | undefined {
	return document.getElementById( `${ form.id }__${ fieldId }` ) || undefined;
} //end getField()

function getFieldErrorWrapper(
	form: HTMLFormElement,
	fieldId: string
): HTMLElement {
	return (
		document.getElementById( `${ form.id }__${ fieldId }-error` ) ||
		createFieldErrorWrapper( form, fieldId )
	);
} //end getFieldErrorWrapper()

function createFieldErrorWrapper(
	form: HTMLFormElement,
	fieldId: string
): HTMLElement {
	const errorWrapper = document.createElement( 'label' );
	errorWrapper.setAttribute( 'id', `${ form.id }__${ fieldId }-error` );
	errorWrapper.setAttribute( 'for', `${ form.id }__${ fieldId }` );
	errorWrapper.classList.add( 'nelio-forms-field__error-label' );
	const parent = document.getElementById(
		`${ form.id }__${ fieldId }`
	)?.parentElement;
	// eslint-disable-next-line no-unused-expressions
	parent?.classList?.contains( 'nelio-forms-field__value-container' )
		? parent?.parentNode?.appendChild( errorWrapper )
		: parent?.appendChild( errorWrapper );
	return errorWrapper;
} //end createFieldErrorWrapper()
