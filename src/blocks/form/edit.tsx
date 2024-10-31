/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import {
	Button,
	Placeholder,
	Spinner,
	TextControl,
	ToolbarButton,
	PanelBody,
	ToolbarGroup,
	Disabled,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import { _x } from '@wordpress/i18n';
import {
	useInnerBlocksProps,
	BlockControls,
	InnerBlocks,
	InspectorControls,
	useBlockProps,
	Warning,
} from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';

/**
 * External dependencies
 */
import { useEntityKind, useFormMeta, useCanUser } from '@nelio/forms/hooks';
import {
	FormActionSettings,
	FormGeneralSettings,
	FormPatterns,
	FormSpamSettings,
	PluginIcon,
	PostSelectControl,
} from '@nelio/forms/components';

/**
 * Internal dependencies
 */
import { BlockContentOverlay } from './block-content-overlay';
import type { Attributes } from './types';
import type { BlockContentOverlayProps } from './block-content-overlay';
import {
	useCreateForm,
	useForms,
	useRefStatus,
	useRenderedFormContent,
} from './hooks';
import './editor.scss';

type LockProps = {
	readonly isLocked: 'no' | 'create' | 'select';
	readonly lock: ( isLocked: 'no' | 'create' | 'select' ) => void;
};

const FORM_LABEL = _x( 'Nelio Form', 'text', 'nelio-forms' );

export default function edit( allowedBlocks: ReadonlyArray< string > ) {
	return ( props: BlockEditProps< Attributes > ): JSX.Element => {
		const {
			attributes: { ref },
			clientId,
		} = props;

		const { isMissing, hasResolved } = useRefStatus( clientId, ref );

		if ( isFakeExample( props ) ) {
			return <FakeExample />;
		} //end if

		if ( ! ref ) {
			return <FormSelector { ...props } />;
		} //end if

		if ( ! hasResolved ) {
			return <Loading />;
		} //end if

		if ( isMissing ) {
			return <MissingForm />;
		} //end if

		return <FormEditor { ...{ ...props, allowedBlocks } } />;
	};
} //end edit()

const FormEditor = (
	props: BlockEditProps< Attributes > & {
		allowedBlocks: ReadonlyArray< string >;
	}
): JSX.Element => {
	const {
		attributes: { ref },
		allowedBlocks,
		clientId,
		setAttributes,
	} = props;

	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'nelio_form',
		{ id: ref }
	);

	const { hasResolvedUserCan, userCan } = useCanUser(
		'update',
		'nelio_form',
		ref
	);

	const [ title, setTitle ] = useEntityProp< string >(
		'postType',
		'nelio_form',
		'title',
		ref
	);

	const [ actions, setActions ] = useFormMeta( 'actions', ref );
	const [ generalSettings, setGeneralSettings ] = useFormMeta(
		'general',
		ref
	);
	const [ spamSettings, setSpamSettings ] = useFormMeta( 'spam', ref );

	const blockProps = useBlockProps( {
		className: 'nelio-forms__editor nelio-forms__editor--ready',
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{},
		{
			value: blocks,
			onInput,
			onChange,
			allowedBlocks,
			renderAppender: blocks?.length
				? undefined
				: InnerBlocks.ButtonBlockAppender,
		}
	);

	const renderedContent = useRenderedFormContent( ref );

	if ( ! hasResolvedUserCan ) {
		return <Loading />;
	} //end if

	if ( hasResolvedUserCan && ! userCan ) {
		return (
			<div { ...blockProps }>
				<Disabled>
					<div
						dangerouslySetInnerHTML={ { __html: renderedContent } }
					></div>
				</Disabled>
			</div>
		);
	} //end if

	const EntryRecordingComponent = applyFilters(
		'nelio_forms.get_entry_recording_component',
		() => null
	) as ( { formId: number } ) => JSX.Element | null;

	return (
		<div { ...blockProps }>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						aria-haspopup="true"
						onClick={ () => setAttributes( { ref: undefined } ) }
					>
						{ _x( 'Replace form', 'command', 'nelio-forms' ) }
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			{ !! hasResolvedUserCan && !! userCan && (
				<InspectorControls>
					<PanelBody>
						<TextControl
							label={ _x( 'Form Title', 'text', 'nelio-forms' ) }
							autoComplete="off"
							value={ title }
							onChange={ setTitle }
						/>
					</PanelBody>
					<PanelBody
						title={ _x( 'Patterns', 'text', 'nelio-forms' ) }
						initialOpen={ false }
					>
						<FormPatterns clientId={ clientId } />
					</PanelBody>
					<PanelBody
						title={ _x(
							'General Settings',
							'text',
							'nelio-forms'
						) }
						initialOpen={ true }
					>
						<FormGeneralSettings
							{ ...{ generalSettings, setGeneralSettings } }
						/>
					</PanelBody>
					<PanelBody
						title={ _x(
							'Submission Actions',
							'text',
							'nelio-forms'
						) }
						initialOpen={ true }
					>
						<EntryRecordingComponent { ...{ formId: ref } } />
						<FormActionSettings
							{ ...{ formId: ref, actions, setActions } }
						/>
					</PanelBody>
					<PanelBody
						title={ _x( 'Spam Detection', 'text', 'nelio-forms' ) }
						initialOpen={ false }
					>
						<FormSpamSettings
							{ ...{ spamSettings, setSpamSettings } }
						/>
					</PanelBody>
				</InspectorControls>
			) }
			<BlockContentOverlay
				form={ ref }
				clientId={ clientId }
				wrapperProps={ innerBlocksProps }
				className="block-library-block__reusable-block-container"
			/>
		</div>
	);
};

const FormSelector = ( props: BlockEditProps< Attributes > ): JSX.Element => {
	const { forms, hasResolved } = useForms();
	const { hasResolvedUserCan, userCan } = useCanUser(
		'create',
		'nelio_form',
		''
	);
	const formType = useEntityKind( 'postType', 'nelio_form' );
	const blockProps = useBlockProps();

	const [ isLocked, lock ] = useState< LockProps[ 'isLocked' ] >( 'no' );

	if ( ! hasResolvedUserCan || ! hasResolved || ! formType ) {
		return <Loading />;
	} //end if

	const isReady = hasResolvedUserCan && hasResolved;

	if ( isReady && forms.length === 0 ) {
		return (
			<div { ...blockProps }>
				<Placeholder
					icon={ PluginIcon }
					label={ FORM_LABEL }
					instructions={
						!! userCan
							? _x( 'Create a new form.', 'text', 'nelio-forms' )
							: _x(
									'Sorry, you are not allowed to create forms.',
									'user',
									'nelio-forms'
							  )
					}
				>
					{ !! userCan && (
						<CreateForm { ...{ ...props, isLocked, lock } } />
					) }
				</Placeholder>
			</div>
		);
	} //end if

	return (
		<div { ...blockProps }>
			<Placeholder
				icon={ PluginIcon }
				label={ FORM_LABEL }
				instructions={
					!! userCan
						? _x(
								'Create a new form or pick an existing one.',
								'user',
								'nelio-forms'
						  )
						: _x( 'Pick an existing form', 'user', 'nelio-forms' )
				}
			>
				{ !! userCan ? (
					<div className="nelio-forms-choice">
						<CreateForm { ...{ ...props, isLocked, lock } } />
						<div className="nelio-forms-choice__separator"></div>
						<SelectForm { ...{ ...props, isLocked, lock } } />
					</div>
				) : (
					<SelectForm { ...{ ...props, isLocked, lock } } />
				) }
			</Placeholder>
		</div>
	);
};

const CreateForm = ( props: BlockEditProps< Attributes > & LockProps ) => {
	const { setAttributes, isLocked, lock } = props;
	const [ title, setTitle ] = useState< string >( '' );
	const createForm = useCreateForm( title, ( ref: number ) =>
		setAttributes( { ref } )
	);

	return (
		<div className="nelio-forms-choice__form-creator">
			<TextControl
				value={ title }
				placeholder={ _x( 'New form title…', 'text', 'nelio-forms' ) }
				autoComplete="off"
				disabled={ isLocked !== 'no' }
				onChange={ ( newValue: string ) => setTitle( newValue ) }
			/>
			<Button
				isPrimary
				isBusy={ isLocked === 'create' }
				disabled={ title.length === 0 || isLocked !== 'no' }
				onClick={ () => {
					lock( 'create' );
					createForm();
				} }
			>
				{ isLocked === 'create'
					? _x( 'Creating…', 'text', 'nelio-forms' )
					: _x( 'Create', 'command', 'nelio-forms' ) }
			</Button>
		</div>
	);
};

const SelectForm = ( props: BlockEditProps< Attributes > & LockProps ) => {
	const { setAttributes, isLocked, lock } = props;

	const [ selectedForm, setSelectedForm ] = useState< number >();

	return (
		<div className="nelio-forms-choice__form-selector">
			<PostSelectControl
				postType="nelio_form"
				value={ selectedForm ? [ selectedForm ] : [] }
				disabled={ isLocked !== 'no' }
				placeholder={ _x(
					'Search an existing form…',
					'user',
					'nelio-forms'
				) }
				isSingle
				onChange={ ( newValue: ReadonlyArray< number > ) =>
					setSelectedForm( newValue[ 0 ] )
				}
			/>
			<Button
				isPrimary
				isBusy={ isLocked === 'select' }
				disabled={ ! selectedForm || isLocked !== 'no' }
				onClick={ () => {
					lock( 'select' );
					setAttributes( {
						ref: selectedForm,
					} );
				} }
			>
				{ _x( 'Pick', 'command', 'nelio-forms' ) }
			</Button>
		</div>
	);
};

const MissingForm = () => {
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<Warning>
				{ _x(
					'Form has been deleted or is unavailable.',
					'text',
					'nelio-forms'
				) }
			</Warning>
		</div>
	);
};

const Loading = () => {
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<Placeholder>
				<Spinner />
			</Placeholder>
		</div>
	);
};

const FakeExample = () => {
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<InnerBlocks />
		</div>
	);
};

const isFakeExample = (
	props: BlockEditProps< Attributes & { fakeExample?: boolean } >
): boolean => !! props.attributes.fakeExample;

// =================
// MISSING TYPE DEFS
// =================

declare module '@wordpress/block-editor' {
	/* eslint-disable no-shadow, @typescript-eslint/ban-types */
	export function useInnerBlocksProps(
		props: Record< string, unknown >,
		options: Record< string, unknown >
	): BlockContentOverlayProps[ 'wrapperProps' ];
	/* eslint-enable no-shadow, @typescript-eslint/ban-types */
} //end module declaration
