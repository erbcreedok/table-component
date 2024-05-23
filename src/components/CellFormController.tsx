import { PartialKeys } from '@tanstack/table-core'
import { useCallback } from 'react'
import { Controller, ControllerProps, useFormContext } from 'react-hook-form'

import {
	Table_Cell,
	TableData,
	TableInstance,
	getCellFieldId,
	validateValue,
} from '../'

export type CellFormControllerProps<TData extends TableData = {}> = {
	cell: Table_Cell<TData>
	table: TableInstance<TData>
	name?: string
} & Omit<PartialKeys<ControllerProps, 'name' | 'control'>, 'name'>
export const CellFormController = <TData extends TableData = {}>(
	props: CellFormControllerProps<TData>
) => {
	const { cell, table, name, ...rest } = props
	const { column, row } = cell
	const { columnDef } = column
	const { validator } = columnDef
	const {
		options: {
			localization: { fieldNameIsRequired },
		},
	} = table
	const fieldId = name ?? getCellFieldId(cell)
	const { control } = useFormContext()

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
			{...rest}
		/>
	)
}
