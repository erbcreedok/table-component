import { TableData } from '../TableComponent'

import { defaultGetSubRows, defaultSetSubRows } from './defaultGetSubRows'

export const flatHierarchyTree = <TData extends TableData = TableData>(
	data: TData[],
	isHierarchyItem: (item: TData) => boolean,
	getSubRows: (
		item: TData,
		index: number
	) => TData[] | undefined = defaultGetSubRows,
	setSubRows: (row: TData, subRows: TData[]) => TData = defaultSetSubRows
) => {
	// Function to recursively filter data
	const filterData = (items: TData[]): TData[] => {
		return items.reduce((acc, item, index) => {
			if (!isHierarchyItem(item)) {
				const subRows = getSubRows(item, index)
				if (subRows && subRows.length > 0) {
					acc.push(setSubRows(item, filterData(subRows)))
				} else {
					acc.push(item)
				}
			}
			acc.push(...filterData(getSubRows(item, index) ?? []))

			return acc
		}, [] as TData[])
	}

	return filterData(data)
}
