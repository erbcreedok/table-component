import { getColumnId } from '../column.utils'
import { Table_Column, ValueTransformer } from '../TableComponent'

import { sortByStringArrayEnd } from './sortByStringArray'

export const getOrderedColumns = <TData extends Record<string, any> = {}>(
	columns: readonly Table_Column<TData>[],
	prepare: ValueTransformer<readonly Table_Column<TData>[]>,
	ordering?:
		| readonly string[]
		| ValueTransformer<readonly Table_Column<TData>[]>
) => {
	if (ordering) {
		if (typeof ordering === 'function') return ordering(columns) // without prepare

		if (Array.isArray(ordering))
			return sortByStringArrayEnd(prepare(columns), ordering, getColumnId)
	}

	return prepare(columns)
}
