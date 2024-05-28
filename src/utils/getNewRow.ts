import { Table } from '@tanstack/react-table'

import { NewRowPlaceholderId } from '../constants'
import { NewRowState } from '../hooks'
import { Table_Row, TableData, TableInstance } from '../TableComponent'

import { createRow } from './createRow'

const findParent = <TData extends TableData = TableData>(
	row: Table_Row<TData>,
	depth: number
): Table_Row<TData> | undefined => {
	if (row.depth === depth) return row
	const parent = row.getParent()
	if (parent && row.depth > depth) {
		return findParent(parent, depth)
	}

	return undefined
}
const findPreviousRow = <TData extends TableData = TableData>(
	row: Table_Row<TData>,
	depth: number
) => {
	if (row.depth === depth) {
		row.toggleExpanded(false)

		return row
	}
	if (row.depth < depth) {
		row.toggleExpanded(true)

		return row
	}
	const parent = findParent(row, depth)
	if (parent?.subRows && parent.subRows.length) {
		parent.toggleExpanded(false)

		return parent
	}

	return parent ?? row
}

const getInitialValues = <TData extends TableData = TableData>(props: {
	row: Table_Row<TData>
	initialValues?: TableData
}) => {
	const { row, initialValues = {} } = props

	return row.getVisibleCells().reduce(
		(acc, { column, getValue }) =>
			column.getIsGrouped()
				? {
						...acc,
						[column.id]: getValue(),
				  }
				: acc,
		initialValues as TData
	)
}

export const getNewRow = <TData extends TableData = TableData>(props: {
	row: Table_Row<TData>
	table: TableInstance<TData>
	depth: number
	initialValues?: TableData
}) => {
	const { row, table, depth, initialValues } = props
	const previousRow = findPreviousRow(row, depth) ?? row
	const newRow: NewRowState<TData> = {
		...(createRow(
			table as Table<TData>,
			NewRowPlaceholderId,
			getInitialValues({ row, initialValues }),
			row.index,
			depth,
			[]
		) as Table_Row<TData>),
		previousRow,
		getParent: () => (depth > 0 ? findParent(row, depth - 1) : undefined),
	}

	return newRow
}
