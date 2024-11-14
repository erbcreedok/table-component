import { Table_Column } from '../../TableComponent'
import { utilColumnsList } from '../../utilColumns'

export const getIndexedExpandableColumn =
	(index: number) => (columns: Table_Column[]) => {
		let arr = [...columns]
		if (index < 0) {
			arr.reverse()
		}
		let i = index < 0 ? -1 : 0
		for (let col of arr) {
			if (!col.getIsGrouped() && !utilColumnsList.includes(col.id)) {
				if (i === index) {
					return col
				}
				i += index < 0 ? -1 : 1
			}
		}

		return null
	}
