import React, { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'

import { Colors, TableData, TableInstance, ToolbarButton } from '../../../'

export type EditButtonProps<TData = TableData> = {
	table: TableInstance<TData>
	enableCaption?: boolean
}
export const EditButton = <TData,>({
	table,
	enableCaption = true,
}: EditButtonProps<TData>) => {
	const {
		options: {
			localization,
			icons: { EditIcon, CancelCircleIcon, CheckCircleFilledIcon },
			onEditingTableSave,
		},
		setIsEditingTable,
	} = table
	const isEditing = table.getState().isEditingTable
	const methods = useFormContext()
	const { getValues } = methods

	const handleEditClick = useCallback(() => {
		setIsEditingTable(true)
	}, [setIsEditingTable])
	const handleEditCancel = useCallback(() => {
		setIsEditingTable(false)
	}, [setIsEditingTable])
	const handleEditSave = useCallback(async () => {
		// needed, to prevent form from ignoring of validation of last edited field
		table.setEditingRow(null)
		queueMicrotask(() => {
			onEditingTableSave?.({
				table,
				exitEditingMode: () => setIsEditingTable(false),
				values: getValues(),
				methods,
			})
		})
	}, [getValues, methods, onEditingTableSave, setIsEditingTable, table])

	const editButton = (
		<ToolbarButton
			table={table}
			icon={<EditIcon />}
			title={localization.edit}
			onClick={handleEditClick}
			enableCaption={enableCaption}
			nativeEventTitle="ActionBar_EditButton"
		/>
	)

	const submitButtons = (
		<>
			<ToolbarButton
				table={table}
				icon={<CheckCircleFilledIcon />}
				title={localization.save}
				onClick={handleEditSave}
				enableCaption={enableCaption}
				nativeEventTitle="ActionBar_EditButton_Save"
				sx={{ color: Colors.LightGreen }}
			/>
			<ToolbarButton
				table={table}
				icon={<CancelCircleIcon />}
				title={localization.cancel}
				onClick={handleEditCancel}
				enableCaption={enableCaption}
				nativeEventTitle="ActionBar_EditButton_Cancel"
			/>
		</>
	)

	return isEditing ? submitButtons : editButton
}
