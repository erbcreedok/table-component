import {
	ControllerFieldState,
	ControllerRenderProps,
	FieldValues,
	useFormContext,
	UseFormStateReturn,
} from 'react-hook-form'

import {
	CellFormController,
	getCellFieldId,
	Table_Cell,
	TableData,
	TableInstance,
} from '..'

import { EditDateField } from './EditDateField'
import { EditSelectField } from './EditSelectField'
import { EditTextField } from './EditTextField'

export type EditCellFieldProps<TData = TableData> = {
	cell: Table_Cell<TData>
	table: TableInstance<TData>
	showLabel?: boolean
}
export type EditCellControllerProps<TData extends FieldValues = any> = {
	field: ControllerRenderProps<TData>
	fieldState: ControllerFieldState
	formState: UseFormStateReturn<TData>
	onCellSave(): void
	onCellCancel(): void
}

export const EditCellField = (props: EditCellFieldProps) => {
	const { cell, table } = props
	const { column, row } = cell
	const { columnDef } = column
	const { editVariant } = columnDef
	const {
		setEditingCell,
		options: { editingMode, onEditingCellSave },
	} = table
	const fieldId = getCellFieldId(cell)
	const { getValues, getFieldState, trigger } = useFormContext()

	const onCellSave = () => {
		if (editingMode === 'table') return
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

	if (columnDef.Edit) {
		if (columnDef.Edit instanceof Function) {
			const { Edit } = columnDef

			return <Edit cell={cell} column={column} row={row} table={table} />
		}

		return <>{columnDef.Edit}</>
	}

	const getRenderValue = (args: {
		field: ControllerRenderProps
		fieldState: ControllerFieldState
		formState: UseFormStateReturn<any>
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

	return <CellFormController cell={cell} render={getRenderValue} />
}
