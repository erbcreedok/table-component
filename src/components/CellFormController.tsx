import { PartialKeys } from '@tanstack/table-core'
import { Controller, ControllerProps, useFormContext } from 'react-hook-form'

import { getCellFieldId, Table_Cell, TableData } from '../'

export type CellFormControllerProps<TData = TableData> = {
	cell: Table_Cell<TData>
	name?: string
} & Omit<PartialKeys<ControllerProps, 'name' | 'control'>, 'name'>
export const CellFormController = <TData,>(
	props: CellFormControllerProps<TData>
) => {
	const { cell, name, ...rest } = props
	const fieldId = name ?? getCellFieldId(cell)
	const { control } = useFormContext()

	return (
		<Controller
			name={fieldId}
			control={control}
			shouldUnregister={false}
			{...rest}
		/>
	)
}
