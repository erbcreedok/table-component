import { getColumnId } from '../column.utils'
import { Table_Column, ValueTransformer } from '../TableComponent'

import { sortByStringArrayEnd } from './sortByStringArray'

export const getOrderedColumns = (
	columns: readonly Table_Column[],
	prepare: ValueTransformer<readonly Table_Column[]>,
	ordering?: readonly string[] | ValueTransformer<readonly Table_Column[]>
) => {
	if (ordering) {
		if (typeof ordering === 'function') return ordering(columns) // without prepare

		if (Array.isArray(ordering))
			return sortByStringArrayEnd(prepare(columns), ordering, getColumnId)
	}

	return prepare(columns)
}
