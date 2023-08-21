import { useState } from 'react'

import { TableCellDataProps, TableData } from '../../TableComponent'

export const useEditField = <V = string, TData extends TableData = TableData>({
	table,
	cell,
}: Omit<TableCellDataProps<TData>, 'column' | 'row'>) => {
	const { getState, setEditingRow } = table
	const { column } = cell
	const { editingRow } = getState()
	const [value, setValue] = useState(() => cell.getValue<V>())
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
