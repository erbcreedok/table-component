import React, { FC } from 'react'

import { Table_Cell, TableInstance } from '..'

interface Props {
	cell: Table_Cell
	table: TableInstance
}

export const TableBodyCellValue: FC<Props> = ({ cell, table }) => {
	const {
		options: { enableAggregationRow },
	} = table
	const { column, row } = cell
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
				: row.getIsGrouped() && !cell.getIsGrouped()
				? null
				: (!enableAggregationRow &&
						column.getIsGrouped() &&
						columnDef.GroupedCell) ||
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
