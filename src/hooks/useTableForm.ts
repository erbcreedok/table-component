import { DeepKeys, noop } from '@tanstack/react-table'
import { MouseEventHandler, useCallback, useEffect } from 'react'
import { useForm, UseFormReturn, Validate } from 'react-hook-form'

import {
	Table_Cell,
	Table_Row,
	TableData,
	TableInstance,
	LiteralUnion,
} from '../TableComponent'
import { validateValue } from '../utils'

import { NewRow } from './useCreateNewRow'
import { useValueListener } from './useValueListener'

export type TableFormValues = Record<string, TableData | undefined | null>
export type TableInstanceWithForm<TData extends TableData = TableData> = {
	getEditableTableRowProps: (row: Table_Row<TData>) => {
		onClick: MouseEventHandler<HTMLTableRowElement>
	}
}
export type OnEditCellSaveProp<TData extends TableData = TableData> = (props: {
	exitEditingMode: () => void
	cell: Table_Cell<TData>
	table: TableInstance<TData>
	value: any
	error: string | null
}) => Promise<void> | void
export type OnEditingRowCancelProp<TData extends TableData = TableData> =
	(props: { row: Table_Row<TData>; table: TableInstance<TData> }) => void
export type OnEditingRowSaveProp<TData extends TableData = TableData> =
	(props: {
		exitEditingMode: () => void
		row: Table_Row<TData>
		table: TableInstance<TData>
		values: Record<LiteralUnion<string & DeepKeys<TData>>, any> | {}
	}) => Promise<void> | void
export type OnEditingTableSaveProp<TData extends TableData = TableData> =
	(props: {
		exitEditingMode: () => void
		table: TableInstance<TData>
		values: Record<LiteralUnion<string & DeepKeys<TData>>, any> | {}
		methods: UseFormReturn<any>
	}) => Promise<void> | void
export type TablePropsWithForm<TData extends TableData = TableData> = {
	onEditingCellSave?: OnEditCellSaveProp<TData>
	onEditingRowCancel?: OnEditingRowCancelProp<TData>
	onEditingRowSave?: OnEditingRowSaveProp<TData>
	onEditingTableSave?: OnEditingTableSaveProp<TData>
}

export const useTableForm = <TData extends TableData = TableData>(
	table: TableInstance<TData>
) => {
	const {
		getState,
		options: { editingMode, formOptions },
		setIsEditingTable,
	} = table
	const { isEditingTable, editingRow, editingCell, newRow } = getState()
	const methods = useForm<TableFormValues>({
		mode: 'onBlur',
		values: {},
		...formOptions,
	})

	useFormStateListener({
		item: editingCell,
		registerItem: useCallback(
			(cell: Table_Cell<TData>) => registerCell(cell, table, methods),
			[methods, table]
		),
		enabled: editingMode === 'cell',
		clearOnExit: editingMode !== 'table',
	})
	useFormStateListener({
		item: editingRow,
		registerItem: useCallback(
			(row: Table_Row<TData>) => registerRow(row, table, methods),
			[methods, table]
		),
		enabled: editingMode === 'row',
		clearOnExit: editingMode !== 'table',
	})
	useFormStateListener({
		item: newRow,
		registerItem: useCallback(
			(newRow: NewRow<TData>) => registerRow(newRow, table, methods),
			[methods, table]
		),
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

					return registerTable(table, methods)
				}

				return noop
			},
			[editingMode, methods, table]
		)
	)

	// Re-register new row values, when editing table
	const flatRows = table.getPrePaginationRowModel().flatRows
	useEffect(() => {
		if (isEditingTable) {
			const values = methods.getValues()
			flatRows.forEach((row) => {
				if (!values[row.id]) {
					registerRow(row, table, methods)
				}
			})
		}
		// no need to catch isEditingTable change
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [flatRows, methods, table])

	return methods
}

const useFormStateListener = <T>(args: {
	item?: T | null
	registerItem: (item: T) => () => void
	enabled?: boolean
	clearOnExit?: boolean
}) => {
	const { item, registerItem, enabled = true, clearOnExit = true } = args
	const listener = useCallback(
		(item?: T | null) => {
			if (!item || !enabled) {
				return () => {}
			}
			const destructor = registerItem(item)

			return () => {
				if (clearOnExit) {
					destructor()
				}
			}
		},
		[enabled, registerItem, clearOnExit]
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
) => `${cell.row.id}.${cell.column.id}`

const registerCell = <TData extends TableData = {}>(
	cell: Table_Cell<TData>,
	table: TableInstance<TData>,
	methods: UseFormReturn
) => {
	const { fieldNameIsRequired } = table.options.localization
	const { register, unregister } = methods
	const {
		column: { columnDef },
		row,
	} = cell
	const id = getCellId(cell)
	const value = getCellEditValue(cell)
	const { validator, required, header } = columnDef
	const validate: Validate<unknown, Record<string, any>> = (
		value,
		formValues
	) =>
		(validator ?? validateValue)({
			value,
			values: formValues,
			table,
			row,
			cell,
		})

	register(id, {
		value,
		validate,
		required: required
			? fieldNameIsRequired?.replace('{column}', String(header))
			: undefined,
	})

	return () => {
		unregister(id)
	}
}

const registerRow = <TData extends TableData = {}>(
	row: Table_Row<TData>,
	table: TableInstance<TData>,
	methods: UseFormReturn
) => {
	const destructors = row
		.getAllCells()
		.map((cell) => registerCell(cell, table, methods))

	return () => {
		destructors.forEach((destructor) => destructor())
	}
}

export const registerTable = <TData extends TableData = {}>(
	table: TableInstance<TData>,
	methods: UseFormReturn
) => {
	const destructors = table
		.getPreExpandedRowModel()
		.flatRows.map((row) => registerRow(row, table, methods))

	return () => {
		destructors.forEach((destructor) => destructor())
	}
}
