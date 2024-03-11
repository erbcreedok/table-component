import { Table_Column, TableData, TableInstance } from '../TableComponent'

// this method help to calculate sticky column positions
// especially helpful for columns that have some borders, which cannot be detected by `column.getStart()` method
// this method has a lot of magic numbers basing from our default border styles.
// Clients can override this method by `getPinnedColumnPosition` prop
export const getDefaultPinnedColumnPosition = <
	TData extends TableData = TableData
>(
	column: Table_Column<TData>,
	table: TableInstance<TData>
) => {
	if (column.getIsPinned() === 'left') {
		const columns = table.getLeftVisibleLeafColumns()
		let acc = 0
		let isPrevColumnGrouped = false
		for (let i = 0; i < columns.length; i += 1) {
			const col = columns[i]
			if (isPrevColumnGrouped && !col.getIsGrouped()) {
				acc -= 4
			}
			if (col.id === column.id) {
				break
			}
			if (col.getIsGrouped()) {
				acc += 6 // grouped border width
			} else {
				acc += 2
			}
			isPrevColumnGrouped = col.getIsGrouped()
		}

		return {
			left: `${column.getStart('left') + acc}px`,
		}
	}
	if (column.getIsPinned() === 'right') {
		const columns = [...table.getRightVisibleLeafColumns()].reverse()
		const acc = (columns.length - column.getPinnedIndex()) * 2 // default border width

		return {
			right: `${
				table.getRightTotalSize() -
				column.getSize() -
				column.getStart('right') +
				acc
			}px`,
		}
	}

	return {}
}
