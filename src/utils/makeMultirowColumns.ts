import {
	MultirowHeaderRow,
	MultirowColumn,
	MultirowColumnAction,
	TableInstance,
	Table_Column,
	TableData,
} from '..'
import { getColumnId, getTotalRight } from '../column.utils'

export const makeMultirowColumns = <TData extends TableData = {}>(
	columns: Table_Column<TData>[],
	multiHeaderRow: MultirowHeaderRow,
	table: TableInstance
) => {
	const columnIdsText = multiHeaderRow.columns.reduce((result, current) => {
		const obj = result
		current.columnIds.forEach((id) => {
			obj[id] = current.shorthandText ?? current.text
		})

		return obj
	}, {})

	const multirowColumnActions: Record<string, MultirowColumnAction[]> =
		multiHeaderRow.columns.reduce((result, current) => {
			const obj = result

			obj[current.shorthandText ?? current.text] =
				current?.columnActions ?? null

			return obj
		}, {})

	const multirowColumns = columns.reduce((result, column) => {
		const isGrouped = column.getIsGrouped()
		const isPinned = column.getIsPinned()
		const text = columnIdsText[getColumnId(column)]
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

		const current = {
			id,
			text,
			isGrouped,
			isPinned,
			leftPinnedPosition,
			rightPinnedPosition,
			colSpan: 1,
			multirowColumnActions: multirowColumnActions[text],
			colIds: [column.id],
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
