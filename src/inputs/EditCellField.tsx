import { useCallback } from 'react'
import {
	Controller,
	useFormContext,
	useWatch,
	UseFormStateReturn,
	ControllerFieldState,
	ControllerRenderProps,
} from 'react-hook-form'

import type { Table_Cell, TableData, TableInstance } from '..'
import { getCellFieldId } from '../stories/utils/getCellFieldId'
import { validateValue } from '../utils/validate'

import { EditDateField } from './EditDateField'
import { EditSelectField } from './EditSelectField'
import { EditTextField } from './EditTextField'

export type EditCellFieldProps<TData extends TableData = TableData> = {
	cell: Table_Cell<TData>
	table: TableInstance<TData>
	showLabel?: boolean
}
export type EditCellControllerProps<TData extends TableData = TableData> = {
	field: ControllerRenderProps<TData>
	fieldState: ControllerFieldState
	formState: UseFormStateReturn<TData>
	onCellSave(): void
	onCellCancel(): void
}

export const EditCellField = <TData extends TableData = TableData>(
	props: EditCellFieldProps<TData>
) => {
	const { cell, table } = props
	const { column, row } = cell
	const { columnDef } = column
	const { editVariant, validator } = columnDef
	const {
		setEditingCell,
		options: {
			onEditingCellSave,
			localization: { fieldNameIsRequired },
		},
	} = table
	const fieldId = getCellFieldId(cell)
	const { control, getValues, getFieldState, trigger } = useFormContext()
	const rowValue = useWatch({
		name: row.id,
		control,
	})
	const validate = useCallback(
		(value, formValues) =>
			(validator ?? validateValue)({
				value,
				values: formValues,
				table,
				row,
				cell,
			}),
		[validator, table, row, cell]
	)

	const onCellSave = () => {
		trigger(fieldId).then((valid) => {
			if (valid) {
				onEditingCellSave?.({
					cell,
					table,
					value: getValues(fieldId),
					error: getFieldState(fieldId).error?.message ?? null,
					exitEditingMode: () => setEditingCell(null),
				})
			}
		})
	}
	const onCellCancel = () => {
		setEditingCell(null)
	}

	if (!rowValue) return null

	if (columnDef.Edit) {
		if (columnDef.Edit instanceof Function) {
			const { Edit } = columnDef

			return <Edit cell={cell} column={column} row={row} table={table} />
		}

		return <>{columnDef.Edit}</>
	}

	const getRenderValue = (args: {
		field: ControllerRenderProps<TableData>
		fieldState: ControllerFieldState
		formState: UseFormStateReturn<TableData>
	}) => {
		const editProps = { ...props, ...args, onCellSave, onCellCancel }
		if (editVariant === 'select' || editVariant === 'multi-select') {
			return <EditSelectField {...editProps} />
		}
		if (editVariant === 'date' || editVariant === 'date-range') {
			return <EditDateField {...editProps} />
		}

		return <EditTextField {...editProps} />
	}

	return (
		<Controller
			name={fieldId}
			control={control}
			rules={{
				validate,
				required: columnDef.required
					? fieldNameIsRequired?.replace('{column}', String(columnDef.header))
					: undefined,
			}}
			render={getRenderValue}
		/>
	)
}
