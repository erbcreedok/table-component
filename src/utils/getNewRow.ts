import { NewRowPlaceholderId } from '../constants'
import { NewRowState } from '../hooks'
import { Table_Row, TableData, TableInstance } from '../TableComponent'

import { createTableRow } from './createTableRow'

const findParent = <TData>(
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
const findPreviousRow = <TData>(row: Table_Row<TData>, depth: number) => {
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

const getInitialValues = <TData>(
	row?: Table_Row<TData>,
	initialValues: TableData = {}
): TableData => {
	return (
		row?.getVisibleCells()?.reduce(
			(acc, { column, getValue }) =>
				column.getIsGrouped()
					? {
							...acc,
							[column.id]: getValue(),
					  }
					: acc,
			initialValues
		) ?? initialValues
	)
}

export type GetNewRowProps<TData> = {
	row?: Table_Row<TData>
	table: TableInstance<TData>
	depth: number
	initialValues?: TableData
}

export const getNewRow = <TData>(props: GetNewRowProps<TData>) => {
	const { row, table, depth, initialValues } = props
	const {
		options: { getNewRowOrigin },
	} = table
	const previousRow = row ? findPreviousRow(row, depth) : undefined
	const newRow: NewRowState<TData> = {
		...(createTableRow(
			table,
			NewRowPlaceholderId,
			(getNewRowOrigin?.(props) ??
				getInitialValues(row, initialValues)) as TData,
			row?.index ?? 0,
			depth,
			[]
		) as Table_Row<TData>),
		previousRow,
		getParent: () =>
			depth > 0 && row ? findParent(row, depth - 1) : undefined,
	}

	return newRow
}
