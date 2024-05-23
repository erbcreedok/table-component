import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { getCellFieldId, Table_Cell, TableData, TableInstance } from '../'

import { TableBodyCellValue } from './TableBodyCellValue'

export type TableBodyCellEditValueProps<TData extends TableData = {}> = {
	cell: Table_Cell<TData>
	table: TableInstance<TData>
}
export const TableBodyCellEditValue = <TData extends TableData = {}>(
	props: TableBodyCellEditValueProps<TData>
) => {
	const { cell, table } = props
	const { getValues } = useFormContext()

	const _cell = useMemo(() => {
		const fieldId = getCellFieldId(cell)

		return { ...cell, getValue: () => getValues(fieldId) }
	}, [cell, getValues])

	return <TableBodyCellValue cell={_cell} table={table} row={cell.row} />
}
