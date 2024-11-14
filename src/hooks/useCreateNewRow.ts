import { OnChangeFn } from '@tanstack/react-table'
import { ReactNode, useCallback } from 'react'

import { Table_Row, TableData, TableInstance } from '../TableComponent'
import { FunctionProps } from '../types'
import { getNewRow } from '../utils/getNewRow'

export const useCreateNewRow = (table: TableInstance) => {
	const { setNewRow } = table
	const { newRow } = table.getState()

	const createNewRow = useCallback(
		(row: Table_Row, depth: number, initialValues?: any) => {
			const newRow = getNewRow({ row, depth, table, initialValues })
			setNewRow(newRow)
		},
		[setNewRow, table]
	)

	const getIsNewRow = useCallback(
		(row: Table_Row) => newRow?.id === row.id,
		[newRow]
	)

	const getIsNewRowHolder = useCallback(
		(row: Table_Row) => newRow?.previousRow?.id === row.id,
		[newRow]
	)

	Object.assign(table, {
		createNewRow,
		getIsNewRow,
		getIsNewRowHolder,
	})
}

// TYPES

export type NewRow<TData = TableData> = Table_Row<TData> & {
	previousRow?: Table_Row<TData>
}
export type CreateNewRowRenderMenuConfigArgs<TData = TableData> = {
	row: Table_Row<TData>
	depth: number
	createNewRow: CreateNewRowMethod<TData>
	closeMenu(): void
}
export type CreateNewRowRenderMenuConfig<TData = TableData> = (
	args: CreateNewRowRenderMenuConfigArgs<TData>
) => ReactNode
export type CreateNewRowButtonsConfig<TData = TableData> = {
	depth: number
	hint?: string
	disabled?: boolean
	renderMenu?: CreateNewRowRenderMenuConfig<TData>
}
export type CreateNewRowButtonsConfigProps<TData = TableData> = (
	| number
	| CreateNewRowButtonsConfig<TData>
)[]
export type NewRowState<TData = TableData> = null | NewRow<TData>
export type EnableCreateNewRowProp<TData = TableData> = FunctionProps<
	boolean,
	{ row: Table_Row<TData> }
>
export type OnNewRowSaveProp<TData = TableData> = (args: {
	exitEditingMode: () => void
	row: NewRow<TData>
	table: TableInstance<TData>
	values: any
}) => void
export type OnNewRowCancelProps<TData = TableData> = (args: {
	row: Table_Row<TData>
	table: TableInstance<TData>
}) => void
export type OrganizeCreateNewRowButtonsPropArgs<TData = TableData> = {
	row: Table_Row<TData>
	depthRange: number[]
	table: TableInstance<TData>
}
export type OrganizeCreateNewRowButtonsProp<TData = TableData> = (
	args: OrganizeCreateNewRowButtonsPropArgs<TData>
) => CreateNewRowButtonsConfigProps<TData>
export type TablePropsWithCreateNewRow<TData = TableData> = {
	enableCreateNewRow?: EnableCreateNewRowProp<TData>
	onNewRowSave?: OnNewRowSaveProp<TData>
	onNewRowCancel?: OnNewRowCancelProps<TData>
	setNewRow?: OnChangeFn<NewRowState<TData>>
	organizeCreateNewRowButtons?: OrganizeCreateNewRowButtonsProp<TData>
}
export type CreateNewRowMethod<TData = TableData> = (
	row: Table_Row<TData>,
	depth: number,
	initialValues?: TData
) => void
export type TableInstanceWithCreateNewRow<TData = TableData> = {
	createNewRow: CreateNewRowMethod<TData>
	getIsNewRow: (row: Table_Row<TData>) => boolean
	getIsNewRowHolder: (row: Table_Row<TData>) => boolean
	setNewRow: OnChangeFn<NewRowState<TData>>
}
