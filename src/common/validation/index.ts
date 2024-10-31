import { domReady, setFieldErrors } from '../dom';

type Validator = (
	errors: ReadonlyArray< string >,
	el: HTMLElement
) => ReadonlyArray< string >;

const validators: Record< string, ReadonlyArray< Validator > > = {
	generic: addGenericValidators(),
};

export function addValidator( fieldType: string, validator?: Validator ): void {
	validators[ fieldType ] = validators[ fieldType ] ?? [];
	validators[ fieldType ] = validator
		? [ ...validators[ fieldType ], validator ]
		: validators[ fieldType ];
} //end addValidator

export function getErrorMessage( fieldType: string, errorId: string ): string {
	if ( ! hasErrorMessages( window ) ) {
		return 'Unknown error';
	} //end if

	return (
		window.NelioFormsErrorMessages?.[ fieldType ]?.[ errorId ] ||
		window.NelioFormsErrorMessages?.generic?.unknown ||
		'Unknown error'
	);
} //end getErrorMessage

function hasErrorMessages( w: unknown ): w is {
	NelioFormsErrorMessages: Record<
		string,
		Record< string, string | undefined > | undefined
	>;
} {
	return !! ( w as Record< string, unknown > ).NelioFormsErrorMessages;
} //end hasErrorMessages()

function addGenericValidators(): ReadonlyArray< Validator > {
	const required = ( errors: ReadonlyArray< string >, el: HTMLElement ) => {
		if ( ! el.hasAttribute( 'required' ) ) {
			return errors;
		} //end if

		if (
			( el instanceof HTMLInputElement ||
				el instanceof HTMLTextAreaElement ||
				el instanceof HTMLSelectElement ) &&
			el.value.length === 0
		) {
			errors = [ ...errors, getErrorMessage( 'generic', 'required' ) ];
		} //end if

		return errors;
	};

	return [ required ];
}

const init = ( el: HTMLElement ) => {
	el.addEventListener( 'keyup', () => validate( el ) );
	el.addEventListener( 'change', () => validate( el ) );
	el.addEventListener( 'blur', () => validate( el ) );
};

const getFieldType = ( el: HTMLElement ): string =>
	el.dataset.fieldType ||
	(
		Array.from( el.classList ).filter(
			( x ) => x.includes( '__value--' ) && ! x.includes( 'required' )
		)[ 0 ] ?? ''
	).split( '--' )[ 1 ] ||
	'';

const getFormOfField = ( el: HTMLElement ): HTMLFormElement | null => {
	const form = document.getElementById( el.id.split( '__' )[ 0 ] );
	return form instanceof HTMLFormElement ? form : null;
};

const getFieldId = ( el: HTMLElement ): string => el.id.split( '__' )[ 1 ];

const validate = debounce( ( el: HTMLElement ) => {
	const type = getFieldType( el );
	// TODO remove this check if validators' script is unique.
	if ( undefined === validators[ type ] ) {
		return;
	}
	const vals = [ ...validators.generic, ...validators[ type ] ];

	const form = getFormOfField( el );
	if ( ! form ) {
		return;
	} //end if
	const fieldId = getFieldId( el );
	const errors = vals.reduce(
		( errs: ReadonlyArray< string >, val: Validator ) => val( errs, el ),
		[]
	);

	setFieldErrors( form, fieldId, errors );
}, 0 );

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce( f: Function, wait: number ) {
	let timeout;
	return ( ...args ) => {
		const g = () => {
			f( ...args );
			timeout = undefined;
		};

		if ( timeout ) {
			clearTimeout( timeout );
			timeout = setTimeout( g, wait );
			return;
		} //end if

		timeout = setTimeout( g, wait );
	};
} //end debounce()

// ======
//  INIT
// ======

domReady( () =>
	Array.from(
		document.querySelectorAll( '.nelio-forms-field__value' )
	).forEach( init )
);
