import React from 'react'

import { Flex } from './components/Flex'
import { SelectCheckbox } from './inputs/SelectCheckbox'
import {
	Table_Row,
	TableComponentProps,
	TableData,
	TableInstance,
} from './TableComponent'

export const utilColumns = {
	expand: 'table-row-expand',
	actions: 'table-row-actions',
	numbers: 'table-row-numbers',
	column: 'table-util-column',
} as const

type UtilColumnCellProps<TData extends TableData> = {
	row: Table_Row<TData>
	table: TableInstance<TData>
}
const UtilColumnCell = <TData extends TableData>({
	table,
	row,
}: UtilColumnCellProps<TData>) => {
	const {
		options: { hideRowSelectionColumn, enableRowSelection },
	} = table

	return (
		<>
			{!hideRowSelectionColumn && enableRowSelection ? (
				<SelectCheckbox row={row} table={table} />
			) : null}
		</>
	)
}

type UtilColumnHeaderProps<TData extends TableData> = {
	parentRow: Table_Row<TData>
	table: TableInstance<TData>
}
const UtilColumnHeader = <TData extends TableData>({
	table,
	parentRow,
}: UtilColumnHeaderProps<TData>) => {
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

export const getUtilColumn = <TData extends TableData>(
	config: TableComponentProps<TData>
) => ({
	Cell: UtilColumnCell,
	Header: UtilColumnHeader,
	header: 'util-column',
	size: config.enableRowSelection ? 40 : 8,
	minSize: config.enableRowSelection ? 40 : 8,
	...config.defaultDisplayColumn,
	...config.displayColumnDefOptions?.[utilColumns.column],
	id: utilColumns.column,
})
