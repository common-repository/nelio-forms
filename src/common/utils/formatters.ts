/**
 * External dependencies
 */
import { mapValues, values, sortBy, reduce } from 'lodash';

export function sortObjectKeysUsingValue(
	obj: Record< string, string >
): Record< string, string > {
	const collection = mapValues( obj, ( value, key ) => ( { key, value } ) );
	const unsortedList = values( collection );
	const sortedList = sortBy( unsortedList, 'value' );
	return reduce(
		sortedList,
		( acc, { key, value } ) => {
			acc[ key ] = value;
			return acc;
		},
		{}
	);
} //end sortObjectKeysUsingValue()
