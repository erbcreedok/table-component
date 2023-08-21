import React from 'react'

import type { Table_Cell, TableInstance } from '..'

import { EditDateField } from './EditDateField'
import { EditSelectField } from './EditSelectField'
import { EditTextField } from './EditTextField'

export type EditCellFieldProps<TData extends Record<string, any> = {}> = {
	cell: Table_Cell<TData>
	table: TableInstance<TData>
	showLabel?: boolean
}

export const EditCellField = <TData extends Record<string, any> = {}>(
	props: EditCellFieldProps<TData>
) => {
	const { cell, table } = props
	const { column, row } = cell
	const { columnDef } = column
	const { editVariant } = columnDef

	if (columnDef.Edit) {
		if (columnDef.Edit instanceof Function) {
			return <>{columnDef.Edit?.({ cell, column, row, table })}</>
		}

		return <>{columnDef.Edit}</>
	}

	if (editVariant === 'select' || editVariant === 'multi-select') {
		return <EditSelectField {...props} />
	}
	if (editVariant === 'date' || editVariant === 'date-range') {
		return <EditDateField {...props} />
	}

	return <EditTextField {...props} />
}
