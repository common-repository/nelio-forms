/**
 * Internal dependencies
 */
import type { OptionGroup } from './types';

export function isOptionGroup( o: unknown ): o is OptionGroup {
	return !! ( o as Record< string, unknown > ).options;
} //end isOptionGroup()
