import { ReactElement, useCallback, useEffect, useState } from 'react'
import {
	Controller,
	ControllerFieldState,
	useFormContext,
} from 'react-hook-form'

import { Table_Row, TableData, TableInstance } from '../TableComponent'
import { scrollToElement } from '../utils/scrollToElement'

import { FloatingActionButtons } from './FloatingActionButtons'
import { NotificationBox } from './NotificationBox'

type EditingRowActionButtonsProps<TData = TableData> = {
	open?: boolean
	children: (args: {
		ref: (node: HTMLTableRowElement | null) => void
	}) => ReactElement
	table: TableInstance<TData>
	row: Table_Row<TData>
	fieldState?: ControllerFieldState
}
export const EditingRowActionButtonsMain = <TData,>({
	open,
	children,
	table,
	row,
	fieldState,
}: EditingRowActionButtonsProps<TData>) => {
	const {
		getState,
		options: {
			onEditingRowSave,
			onEditingRowCancel,
			onNewRowSave,
			localization: { requiredFieldIsHidden },
		},
		refs: { tableContainerRef, tableHeadCellRefs },
		setEditingRow,
		setNewRow,
	} = table
	const { columnVisibility } = getState()
	const { editingRow, newRow } = getState()
	const isNewRow = table.getIsNewRow(row)
	const { trigger, getValues, getFieldState } = useFormContext()
	const [rowError, setRowError] = useState<string | undefined>()

	const handleCancel = useCallback(() => {
		if (isNewRow) {
			setNewRow(null)
		} else {
			onEditingRowCancel?.({ row, table })
			setEditingRow(null)
		}
	}, [isNewRow, onEditingRowCancel, row, setEditingRow, setNewRow, table])

	useEffect(() => {
		setRowError(undefined)
	}, [columnVisibility])

	const handleSave = useCallback(async () => {
		const currentRow = isNewRow ? newRow : editingRow
		if (currentRow) {
			if (!(await trigger(currentRow.id))) {
				const { error } = getFieldState(currentRow.id)
				const firstErrorKey = Object.keys(error ?? {})[0]
				if (firstErrorKey) {
					const errorTableHeadEl = tableHeadCellRefs.current[firstErrorKey]
					if (errorTableHeadEl && tableContainerRef.current) {
						scrollToElement(errorTableHeadEl, tableContainerRef.current)
					}
				}

				return
			}
			if (isNewRow && newRow) {
				const isRequiredColumnHidden = newRow
					.getAllCells()
					.some(
						({ column: { columnDef, getIsVisible } }) =>
							columnDef.required && !getIsVisible()
					)
				if (isRequiredColumnHidden) {
					setRowError(requiredFieldIsHidden)

					return
				}
				onNewRowSave?.({
					exitEditingMode: () => setNewRow(null),
					row: newRow,
					table,
					values: getValues(newRow.id),
				})
			} else if (editingRow) {
				onEditingRowSave?.({
					exitEditingMode: () => setEditingRow(null),
					row: editingRow ?? row,
					table,
					values: getValues(editingRow.id),
				})
			}
		}
	}, [
		isNewRow,
		newRow,
		editingRow,
		trigger,
		getFieldState,
		tableHeadCellRefs,
		tableContainerRef,
		onNewRowSave,
		table,
		getValues,
		requiredFieldIsHidden,
		setNewRow,
		onEditingRowSave,
		row,
		setEditingRow,
	])

	const onCloseNotification = useCallback(() => {
		setRowError(undefined)
	}, [])

	const anyError = fieldState?.error?.message ?? rowError

	return (
		<FloatingActionButtons
			table={table}
			open={open}
			onSubmit={handleSave}
			onCancel={handleCancel}
			adornment={
				anyError ? (
					<NotificationBox
						size="small"
						text={anyError}
						type="danger"
						sx={{ width: 'auto' }}
						closeAutomatically
						onClose={onCloseNotification}
					/>
				) : null
			}
		>
			{children}
		</FloatingActionButtons>
	)
}

export const EditingRowActionButtons = <TData,>({
	children,
	...props
}: EditingRowActionButtonsProps<TData>) => {
	const methods = useFormContext()
	if (!props.table.getState().isEditingTable) {
		return (
			<EditingRowActionButtonsMain {...props}>
				{children}
			</EditingRowActionButtonsMain>
		)
	}

	return (
		<Controller
			name={props.row.id}
			control={methods.control}
			render={({ fieldState }) => (
				<EditingRowActionButtonsMain {...props} fieldState={fieldState}>
					{children}
				</EditingRowActionButtonsMain>
			)}
		/>
	)
}
