import { FC, useCallback, useMemo } from 'react'

import { TableBodyRowProps } from '../body/TableBodyRow'
import { Table_Row, TableData, TableInstance } from '../TableComponent'

import { NewRow } from './useCreateNewRow'

export const useTableHierarchy = <TData>(table: TableInstance<TData>) => {
	const { getPreExpandedRowModel, getIsNewRow, isHierarchyItem } = table

	const data = getPreExpandedRowModel().rows

	const depthMap = useMemo(() => {
		if (!isHierarchyItem) {
			return {}
		}
		// key: string - row id
		// value: number - count of hierarchical parents
		const depthMap: Record<string, number> = {}

		// Function to recursively traverse the data and calculate depth
		const traverse = (items: Table_Row<TData>[], parentDepth = 0) => {
			items.forEach((item) => {
				// Calculate depth based on parent, adjusting if item is a hierarchy item
				const depth = isHierarchyItem(item.original)
					? parentDepth + 1
					: parentDepth
				depthMap[item.id] = parentDepth

				// Recurse into subRows if present
				if (item.subRows?.length) {
					traverse(item.subRows, depth)
				}
			})
		}
		traverse(data)

		return depthMap
	}, [data, isHierarchyItem])

	const getRelativeDepth = useCallback(
		(row: Table_Row<TData>) => {
			let relativeDepth = depthMap[row.id]
			if (getIsNewRow(row)) {
				const newRow = row as NewRow<TData>
				const prevRow = newRow.previousRow
				if (prevRow) {
					relativeDepth = depthMap[prevRow.id]
				}
			}

			return row.depth - (relativeDepth ?? 0)
		},
		[depthMap, getIsNewRow]
	)

	const getHierarchyParentsCount = useCallback(
		(row: Table_Row<TData>) => {
			return depthMap[row.id]
		},
		[depthMap]
	)

	Object.assign(table, {
		getRelativeDepth,
		getHierarchyParentsCount,
	})
}

// TYPES
export type IsHierarchyItemConfig<TData = TableData> = (row: TData) => boolean
export type ShowTableHeaderHierarchyConfig<TData = TableData> =
	| boolean
	| ((row: Table_Row<TData>, table: TableInstance<TData>) => boolean)
export type HierarchyTreeConfig<TData = TableData> = {
	isHierarchyItem: IsHierarchyItemConfig<TData>
	getValue?: (row: TData) => string
	showTableHeader?: ShowTableHeaderHierarchyConfig<TData>
	enableHierarchyTree?: boolean
	HierarchyRow?: FC<TableBodyRowProps<TData>>
	HierarchyComponent?: FC<TableBodyRowProps<TData>>
}
export type GetRelativeDepthMethod<TData = TableData> = (
	row: Table_Row<TData>
) => number
export type GetHierarchyParentsCountMethod<TData = TableData> = (
	row: Table_Row<TData>
) => number | undefined
export type TableInstanceWithTableHierarchy<TData = TableData> = {
	getRelativeDepth: GetRelativeDepthMethod<TData>
	getHierarchyParentsCount: GetHierarchyParentsCountMethod<TData>
}
