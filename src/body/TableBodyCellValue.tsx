import { Table_Cell, Table_Row, TableData, TableInstance } from '..'

interface Props<TData extends TableData = TableData> {
	cell: Table_Cell<TData>
	table: TableInstance<TData>
	row: Table_Row<TData>
}

export const TableBodyCellValue = <TData extends TableData = TableData>({
	cell,
	table,
	row,
}: Props<TData>) => {
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
						children:
							columnDef?.Cell?.({
								cell,
								column,
								row,
								table,
								children: ((row) => row.getGroupingValue(column.id))(
									row.groupRows[row.groupIds[column.id]]
								),
							}) ?? cell.renderValue(),
				  })
				: columnDef?.Cell?.({ cell, column, row, table }) ?? cell.renderValue()}
		</>
	)
}
