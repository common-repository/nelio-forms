/**
 * WordPress dependencies
 */
import * as React from '@wordpress/element';
import { Icon } from '@wordpress/icons';
import { SVG, Path } from '@wordpress/primitives';
import type { IconProps } from '@wordpress/icons/build-types/icon';

export const PluginIcon = ( {
	height,
	width,
	...props
}: Omit< IconProps, 'icon' > ): JSX.Element => (
	<Icon
		icon={ ICON }
		height={ height ?? 20 }
		width={ width ?? 20 }
		{ ...props }
	/>
);

const ICON = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
		<Path d="m 2,2 h 16 c 0.55,0 1,0.45 1,1 v 14 c 0,0.55 -0.45,1 -1,1 H 2 C 1.45,18 1,17.55 1,17 V 3 C 1,2.45 1.45,2 2,2 Z M 17,16 V 5 H 3 V 16 Z M 4,6 V 7 H 9 V 6 Z m 0,2 v 2 H 16 V 8 Z m 0,3 v 1 h 5 v -1 z m 0,2 v 2 h 12 v -2 z" />
	</SVG>
);
