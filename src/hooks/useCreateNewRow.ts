import { OnChangeFn } from '@tanstack/react-table'
import { ReactNode, useCallback } from 'react'

import { Table_Row, TableData, TableInstance } from '../TableComponent'
import { FunctionProps } from '../types'
import { getNewRow } from '../utils/getNewRow'

export const useCreateNewRow = <TData extends TableData = TableData>(
	table: TableInstance<TData>
) => {
	const { setNewRow } = table
	const { newRow } = table.getState()

	const createNewRow = useCallback(
		(row: Table_Row<TData>, depth: number, initialValues?: TableData) => {
			const newRow = getNewRow({ row, depth, table, initialValues })
			setNewRow(newRow)
		},
		[setNewRow, table]
	)

	const getIsNewRow = useCallback(
		(row: Table_Row<TData>) => newRow?.id === row.id,
		[newRow]
	)

	const getIsNewRowHolder = useCallback(
		(row: Table_Row<TData>) => newRow?.previousRow?.id === row.id,
		[newRow]
	)

	Object.assign(table, {
		createNewRow,
		getIsNewRow,
		getIsNewRowHolder,
	})
}

// TYPES

export type NewRow<TData extends TableData = TableData> = Table_Row<TData> & {
	previousRow?: Table_Row<TData>
}
export type CreateNewRowRenderMenuConfigArgs<
	TData extends TableData = TableData
> = {
	row: Table_Row<TData>
	depth: number
	createNewRow: CreateNewRowMethod<TData>
	closeMenu(): void
}
export type CreateNewRowRenderMenuConfig<TData extends TableData = TableData> =
	(args: CreateNewRowRenderMenuConfigArgs<TData>) => ReactNode
export type CreateNewRowButtonsConfig<TData extends TableData = TableData> = {
	depth: number
	hint?: string
	disabled?: boolean
	renderMenu?: CreateNewRowRenderMenuConfig<TData>
}
export type CreateNewRowButtonsConfigProps<
	TData extends TableData = TableData
> = (number | CreateNewRowButtonsConfig<TData>)[]
export type NewRowState<TData extends TableData = TableData> =
	null | NewRow<TData>
export type EnableCreateNewRowProp<TData extends TableData = TableData> =
	FunctionProps<boolean, { row: Table_Row<TData> }>
export type OnNewRowSaveProp<TData extends TableData = TableData> = (args: {
	exitEditingMode: () => void
	row: NewRow<TData>
	table: TableInstance<TData>
	values: any
}) => void
export type OnNewRowCancelProps<TData extends TableData = TableData> = (args: {
	row: Table_Row<TData>
	table: TableInstance<TData>
}) => void
export type OrganizeCreateNewRowButtonsPropArgs<
	TData extends TableData = TableData
> = {
	row: Table_Row<TData>
	depthRange: number[]
	table: TableInstance<TData>
}
export type OrganizeCreateNewRowButtonsProp<
	TData extends TableData = TableData
> = (
	args: OrganizeCreateNewRowButtonsPropArgs<TData>
) => CreateNewRowButtonsConfigProps<TData>
export type TablePropsWithCreateNewRow<TData extends TableData = TableData> = {
	enableCreateNewRow?: EnableCreateNewRowProp<TData>
	onNewRowSave?: OnNewRowSaveProp<TData>
	onNewRowCancel?: OnNewRowCancelProps<TData>
	setNewRow?: OnChangeFn<NewRowState<TData>>
	organizeCreateNewRowButtons?: OrganizeCreateNewRowButtonsProp<TData>
}
export type CreateNewRowMethod<TData extends TableData = TableData> = (
	row: Table_Row<TData>,
	depth: number,
	initialValues?: TableData
) => void
export type TableInstanceWithCreateNewRow<TData extends TableData = TableData> =
	{
		createNewRow: CreateNewRowMethod<TData>
		getIsNewRow: (row: Table_Row<TData>) => boolean
		getIsNewRowHolder: (row: Table_Row<TData>) => boolean
		setNewRow: OnChangeFn<NewRowState<TData>>
	}
