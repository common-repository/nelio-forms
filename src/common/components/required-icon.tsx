/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { Icon } from '@wordpress/icons';
import { SVG, Path } from '@wordpress/primitives';
import type { IconProps } from '@wordpress/icons/build-types/icon';

export const RequiredIcon = ( {
	height,
	width,
	...props
}: Omit< IconProps, 'icon' > ): JSX.Element => (
	<Icon
		icon={ ICON }
		height={ height ?? 24 }
		width={ width ?? 24 }
		{ ...props }
	/>
);

const ICON = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<Path fill="none" d="M0 0h24v24H0V0z" />
		<Path
			d="M8.23118 8L16 16M8 16L15.7688 8 M6.5054 11.893L17.6567 11.9415M12.0585 17.6563L12 6.5"
			stroke="currentColor"
		/>
	</SVG>
);
