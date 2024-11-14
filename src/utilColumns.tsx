import React from 'react'

import { Flex } from './components/Flex'
import { SelectCheckbox } from './inputs/SelectCheckbox'
import {
	Table_Row,
	TableComponentProps,
	TableData,
	TableInstance,
} from './TableComponent'
import { getIsMockRow } from './utils/getIsMockRow'

export const utilColumns = {
	expand: 'table-row-expand',
	actions: 'table-row-actions',
	column: 'table-util-column',
} as const

export const utilColumnsList: string[] = Object.values(utilColumns)

export const DEFAULT_EXPAND_PADDING = 12

type UtilColumnCellProps<TData = TableData> = {
	row: Table_Row<TData>
	table: TableInstance<TData>
}
const UtilColumnCell = ({ table, row }: UtilColumnCellProps) => {
	const {
		options: { hideRowSelectionColumn, enableRowSelection },
	} = table

	return (
		<>
			{!hideRowSelectionColumn &&
			enableRowSelection &&
			!getIsMockRow(row) &&
			!table.getIsNewRow(row) ? (
				<SelectCheckbox row={row} table={table} />
			) : null}
		</>
	)
}

type UtilColumnHeaderProps<TData = TableData> = {
	parentRow: Table_Row<TData>
	table: TableInstance<TData>
}
const UtilColumnHeader = ({ table, parentRow }: UtilColumnHeaderProps) => {
	const {
		options: {
			hideRowSelectionColumn,
			enableRowSelection,
			enableSelectAll,
			enableMultiRowSelection,
		},
	} = table

	return (
		<Flex sx={{ pl: '9px' }}>
			{!hideRowSelectionColumn &&
				enableRowSelection &&
				enableSelectAll &&
				enableMultiRowSelection && (
					<SelectCheckbox
						selectAll={!parentRow}
						parentRow={parentRow}
						table={table}
					/>
				)}
		</Flex>
	)
}

export const getUtilColumn = (config: TableComponentProps) => ({
	Cell: UtilColumnCell,
	Header: UtilColumnHeader,
	header: 'util-column',
	size: config.enableRowSelection || config.enableRowNumbers ? 40 : 8,
	minSize: config.enableRowSelection || config.enableRowNumbers ? 40 : 8,
	...config.defaultDisplayColumn,
	...config.displayColumnDefOptions?.[utilColumns.column],
	id: utilColumns.column,
})
