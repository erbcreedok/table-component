import { useCallback } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

import {
	Table_Cell,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

import { NewRow } from './useCreateNewRow'
import { useValueListener } from './useValueListener'

export type TableFormValues = Record<string, TableData | undefined | null>

export const useTableForm = <TData extends TableData = TableData>(
	table: TableInstance<TData>
) => {
	const { getState } = table
	const { editingRow, editingCell, newRow } = getState()
	const methods = useForm<TableFormValues>({
		mode: 'onBlur',
		values: {},
	})

	useFormStateListener({
		item: editingCell,
		getId: getCellId,
		getValue: getCellValue,
		methods,
	})
	useFormStateListener({
		item: editingRow,
		getId: getRowId,
		getValue: getRowValue,
		methods,
	})
	useFormStateListener({
		item: newRow,
		getId: getRowId,
		getValue: getNewRowValue,
		methods,
	})

	return methods
}

const useFormStateListener = <T>(args: {
	item?: T | null
	getId: (item: NonNullable<T>) => string
	getValue: (item: NonNullable<T>) => TableData
	methods: UseFormReturn<TableFormValues>
}) => {
	const { item, getId, getValue, methods } = args
	const { setValue, resetField } = methods
	const listener = useCallback(
		(item?: T | null) => {
			if (!item) {
				return () => {}
			}
			setValue(getId(item), getValue(item))

			return () => {
				resetField(getId(item))
			}
		},
		[getId, getValue, setValue, resetField]
	)

	useValueListener(item, listener)
}

export const getCellEditValue = <TData extends TableData = TableData>(
	cell: Table_Cell<TData>
) =>
	cell.column.columnDef.getEditValue
		? cell.column.columnDef.getEditValue(cell.row.original)
		: cell.getValue()

const getCellId = <TData extends TableData = TableData>(
	cell: Table_Cell<TData>
) => cell.row.id
const getCellValue = <TData extends TableData = TableData>(
	cell: Table_Cell<TData>
) => ({
	[cell.column.id]: getCellEditValue(cell),
})
const getRowId = <TData extends TableData = TableData>(row: Table_Row<TData>) =>
	row.id
const getRowValue = <TData extends TableData = TableData>(
	row: Table_Row<TData>
) =>
	row.getAllCells().reduce(
		(acc, cell) => ({
			...acc,
			[cell.column.id]: getCellEditValue(cell),
		}),
		{}
	)
const getNewRowValue = <TData extends TableData = TableData>(
	row: NewRow<TData>
) => ({ ...getRowValue(row), ...row.original })
