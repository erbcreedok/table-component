import React, { FC } from 'react'

import { Table_Cell, Table_Row, TableInstance } from '..'

interface Props {
	cell: Table_Cell
	table: TableInstance
	row: Table_Row
}

export const TableBodyCellValue: FC<Props> = ({ cell, table, row }) => {
	const { column } = cell
	const { columnDef } = column

	return (
		<>
			{cell.getIsAggregated() && columnDef.AggregatedCell
				? columnDef.AggregatedCell({
						cell,
						column,
						row,
						table,
				  })
				: row?.getIsGrouped?.() && !cell?.getIsGrouped?.()
				? null
				: (column.getIsGrouped() && columnDef.GroupedCell) ||
				  (cell.getIsGrouped() && columnDef.GroupedCell)
				? columnDef.GroupedCell({
						cell,
						column,
						row,
						table,
				  })
				: columnDef?.Cell?.({ cell, column, row, table }) ?? cell.renderValue()}
		</>
	)
}
