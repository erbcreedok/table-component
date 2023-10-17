import { useCallback, useState } from 'react'

import { Table_Row, TableCellDataProps, TableData } from '../TableComponent'

export type UseEditFieldProps<TData extends TableData> = Omit<
	TableCellDataProps<TData>,
	'column' | 'row'
> & {
	getValue?: (row: Table_Row<TData>) => any
}
export const useEditField = <
	TData extends TableData = TableData,
	V = string | undefined
>({
	table,
	cell,
	getValue,
}: UseEditFieldProps<TData>) => {
	const {
		getState,
		setEditingRow,
		setEditingCell,
		options: { onEditingCellSave },
	} = table
	const { column, row } = cell
	const { validator } = column.columnDef
	const { editingRow, editingCell } = getState()
	const [value, setValue] = useState(() =>
		getValue ? getValue(row) : cell.getValue<V>()
	)
	const getError = useCallback<(value: any) => string | null>(
		(value) => {
			if (validator) {
				const validatorResult = validator({ value, cell, row, table })
				if (validatorResult === true) return null
				if (validatorResult === false) return ''

				return validatorResult
			}

			return null
		},
		[cell, row, table, validator]
	)
	const [error, setError] = useState<string | null>()
	const saveData = (newValue: V) => {
		const error = getError(newValue)
		setError(error)
		if (editingRow) {
			// do not change the reference for row, keep same object, just update values
			// also, Object.assign prevent react from rerender, if somehow you will need to rerender table with new values in editingRow, then simply use spreading operator instead of Object.assign
			Object.assign(editingRow, {
				errors: {
					...editingRow.errors,
					[column.id]: error,
				},
				_valuesCache: { ...editingRow._valuesCache, [column.id]: newValue },
			})
			setEditingRow(editingRow)
		}
		if (editingCell) {
			if (onEditingCellSave) {
				onEditingCellSave({
					cell,
					table,
					value: newValue,
					error,
					exitEditingMode: () => setEditingCell(null),
				})
			} else if (!error) {
				setEditingCell(null)
			}
		}
	}

	return {
		error,
		value,
		setError,
		setValue,
		saveData,
	}
}
