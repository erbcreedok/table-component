import type { DeepKeys } from '@tanstack/react-table'
import { MouseEventHandler, useCallback, useEffect } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'

import {
	Table_Cell,
	Table_Row,
	TableData,
	TableInstance,
	LiteralUnion,
} from '../TableComponent'

import { NewRow } from './useCreateNewRow'
import { useValueListener } from './useValueListener'

export type TableFormValues = Record<string, TableData | undefined | null>
export type TableInstanceWithForm<TData extends TableData = TableData> = {
	getEditableTableRowProps: (row: Table_Row<TData>) => {
		onClick: MouseEventHandler<HTMLTableRowElement>
	}
}
export type TablePropsWithForm<TData extends TableData = TableData> = {
	onEditingCellSave?: (props: {
		exitEditingMode: () => void
		cell: Table_Cell<TData>
		table: TableInstance<TData>
		value: any
		error: string | null
	}) => Promise<void> | void
	onEditingRowCancel?: (props: {
		row: Table_Row<TData>
		table: TableInstance<TData>
	}) => void
	onEditingRowSave?: (props: {
		exitEditingMode: () => void
		row: Table_Row<TData>
		table: TableInstance<TData>
		values: Record<LiteralUnion<string & DeepKeys<TData>>, any> | {}
	}) => Promise<void> | void
	onEditingTableSave?: (props: {
		exitEditingMode: () => void
		table: TableInstance<TData>
		values: Record<LiteralUnion<string & DeepKeys<TData>>, any> | {}
		methods: UseFormReturn<any>
	}) => Promise<void> | void
}

export const useTableForm = <TData extends TableData = TableData>(
	table: TableInstance<TData>
) => {
	const {
		getState,
		options: { editingMode },
		getRowModel,
		setIsEditingTable,
	} = table
	const { isEditingTable, editingRow, editingCell, newRow } = getState()
	const methods = useForm<TableFormValues>({
		mode: 'onBlur',
		values: {},
	})
	const { reset, getValues, setValue } = methods

	useFormStateListener({
		item: editingCell,
		getId: getCellId,
		getValue: getCellValue,
		methods,
		enabled: editingMode === 'cell',
		clearOnExit: editingMode !== 'table',
	})
	useFormStateListener({
		item: editingRow,
		getId: getRowId,
		getValue: getRowValue,
		methods,
		enabled: editingMode === 'row',
		clearOnExit: editingMode !== 'table',
	})
	useFormStateListener({
		item: newRow,
		getId: getRowId,
		getValue: getNewRowValue,
		methods,
		clearOnExit: isEditingTable,
	})

	// clear editingRow on exit editing mode
	useValueListener(
		editingMode,
		useCallback(
			(editingMode) => {
				if (editingMode !== 'table' && isEditingTable) {
					setIsEditingTable(false)
				}
			},
			[isEditingTable, setIsEditingTable]
		)
	)

	useValueListener(
		isEditingTable,
		useCallback(
			(enabled) => {
				if (
					editingMode === 'table' &&
					!enabled &&
					table.getState().editingRow
				) {
					table.setEditingRow(null)
				}
				if (enabled && editingMode === 'table') {
					table.setRowSelection({})
					const values = {}
					getRowModel().flatRows.forEach((row) => {
						values[getRowId(row)] = getRowValue(row)
					})
					reset(values)

					return () => reset({})
				}

				return () => {}
			},
			[editingMode, getRowModel, reset, table]
		)
	)

	const flatRows = getRowModel().flatRows
	useEffect(() => {
		if (isEditingTable) {
			const values = getValues()
			flatRows.forEach((row) => {
				if (!values[getRowId(row)]) {
					setValue(getRowId(row), getRowValue(row))
				}
			})
		}
		// no need to catch isEditingTable change
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [flatRows, getValues, setValue])

	return methods
}

const useFormStateListener = <T>(args: {
	item?: T | null
	getId: (item: NonNullable<T>) => string
	getValue: (item: NonNullable<T>) => TableData
	methods: UseFormReturn<TableFormValues>
	enabled?: boolean
	clearOnExit?: boolean
}) => {
	const {
		item,
		getId,
		getValue,
		methods,
		enabled = true,
		clearOnExit = true,
	} = args
	const { setValue, resetField } = methods
	const listener = useCallback(
		(item?: T | null) => {
			if (!item || !enabled) {
				return () => {}
			}
			setValue(getId(item), getValue(item))

			return () => {
				if (clearOnExit) resetField(getId(item))
			}
		},
		[enabled, setValue, getId, getValue, clearOnExit, resetField]
	)

	useValueListener(item, listener)
}

export const useTableWithFormMethods = <TData extends TableData = TableData>(
	table: TableInstance<TData>
) => {
	const getEditableTableRowProps = useCallback(
		(row: Table_Row<TData>) => ({
			onClick: () => {
				const { isEditingTable } = table.getState()
				if (isEditingTable) {
					table.setEditingRow(row)
				}
			},
		}),
		[table]
	)

	Object.assign(table, {
		getEditableTableRowProps,
	})
}

export const getCellEditValue = <TData extends TableData = TableData>(
	cell: Table_Cell<TData>
) =>
	cell.column.columnDef.getEditValue
		? cell.column.columnDef.getEditValue(cell.row.original)
		: cell.getValue()

export const getCellId = <TData extends TableData = TableData>(
	cell: Table_Cell<TData>
) => cell.row.id
export const getCellValue = <TData extends TableData = TableData>(
	cell: Table_Cell<TData>
) => ({
	[cell.column.id]: getCellEditValue(cell),
})
export const getRowId = <TData extends TableData = TableData>(
	row: Table_Row<TData>
) => row.id
export const getRowValue = <TData extends TableData = TableData>(
	row: Table_Row<TData>
) =>
	row.getAllCells().reduce(
		(acc, cell) => ({
			...acc,
			[cell.column.id]: getCellEditValue(cell),
		}),
		{}
	)
export const getNewRowValue = <TData extends TableData = TableData>(
	row: NewRow<TData>
) => ({ ...getRowValue(row), ...row.original })
