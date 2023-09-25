import { useState } from 'react'

import { Table_Row, TableCellDataProps, TableData } from '../../TableComponent'

export type UseEditFieldProps<TData extends TableData> = Omit<
	TableCellDataProps<TData>,
	'column' | 'row'
> & {
	getValue?: (row: Table_Row<TData>) => any
}
export const useEditField = <V = string, TData extends TableData = TableData>({
	table,
	cell,
	getValue,
}: UseEditFieldProps<TData>) => {
	const { getState, setEditingRow } = table
	const { column, row } = cell
	const { editingRow } = getState()
	const [value, setValue] = useState(() =>
		getValue ? getValue(row) : cell.getValue<V>()
	)
	const saveRow = (newValue: V) => {
		if (editingRow) {
			setEditingRow({
				...editingRow,
				_valuesCache: { ...editingRow._valuesCache, [column.id]: newValue },
			})
		}
	}

	return {
		value,
		setValue,
		saveRow,
	}
}
