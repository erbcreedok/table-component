import {
	MultirowHeaderRow,
	MultirowColumn,
	MultirowColumnAction,
	TableInstance,
	Table_Column,
	TableData,
	MultirowHeaderColumn,
} from '..'
import { getColumnId, getTotalRight } from '../column.utils'

import type { EmptyColumn } from './getNonCollapsedColumnItems'

export const makeMultirowColumns = <TData extends TableData = {}>(
	columns: ((Table_Column<TData> & { empty?: false }) | EmptyColumn)[],
	multiHeaderRow: MultirowHeaderRow,
	table: TableInstance
) => {
	const multirowColumnByColumnId = multiHeaderRow.columns.reduce<
		Record<string, MultirowHeaderColumn>
	>((result, current) => {
		for (const id of current.columnIds) {
			result[id] = current
		}

		return result
	}, {})

	const multirowColumnActions: Record<string, MultirowColumnAction[]> =
		multiHeaderRow.columns.reduce((result, current) => {
			result[current.shorthandText ?? current.text] =
				current?.columnActions ?? null

			return result
		}, {})

	const multirowColumns = columns
		.reduce((result, column) => {
			if (column.empty) {
				const columns = column.collapsedColumns.map(
					(id) =>
						table
							.getAllColumns()
							.find((el) => el.id === id) as Table_Column<TData>
				)

				result.push(...columns)
			} else {
				result.push(column)
			}

			return result
		}, [] as Table_Column<TData>[])
		.reduce((result, column) => {
			const isGrouped = column.getIsGrouped()
			const isPinned = column.getIsPinned()
			const multirowColumn = multirowColumnByColumnId[getColumnId(column)] as
				| MultirowHeaderColumn
				| undefined

			// if (!multirowColumn) return result // todo

			const text = multirowColumn?.shorthandText ?? multirowColumn?.text ?? ''

			let id = text ?? 'none'
			let leftPinnedPosition: number | undefined
			let rightPinnedPosition: number | undefined

			if (isPinned) {
				id = `${id}-pinned:${isPinned}`
				if (isPinned === 'left') {
					leftPinnedPosition = column.getStart('left')
				}
				if (isPinned === 'right') {
					rightPinnedPosition = getTotalRight(table, column)
				}
			}

			const originalColIds =
				multiHeaderRow.columns.find(
					(col) => col.text === text || col.shorthandText === text
				)?.columnIds ?? []

			const current = {
				id,
				text,
				renderText: multirowColumn?.renderText,
				isGrouped,
				isPinned,
				leftPinnedPosition,
				rightPinnedPosition,
				colSpan: 1,
				multirowColumnActions: multirowColumnActions[text],
				colIds: [column.id],
				depth: multiHeaderRow.depth,
				originalColIds,
			}

			if (!result.length) {
				result.push(current)

				return result
			}

			const prev = result[result.length - 1]

			if (id === prev.id) {
				prev.colSpan += 1
				prev.colIds = [...prev?.colIds, column.id]
				if (prev.isPinned === 'right' && prev.rightPinnedPosition) {
					prev.rightPinnedPosition = getTotalRight(table, column)
				}
			} else {
				result.push(current)
			}

			return result
		}, [] as MultirowColumn[])

	const uniqueIdsCount = {}

	// handle duplicate ids
	return multirowColumns.map((multirowColumn) => {
		if (!uniqueIdsCount[multirowColumn.id]) {
			uniqueIdsCount[multirowColumn.id] = 0
		}
		uniqueIdsCount[multirowColumn.id] += 1
		if (uniqueIdsCount[multirowColumn.id] > 1) {
			multirowColumn.id = `${multirowColumn.id}-${
				uniqueIdsCount[multirowColumn.id]
			}`
		}

		return multirowColumn
	})
}
