import { TableData } from '../TableComponent'

export const defaultGetSubRows = (row) => row?.subRows
export const defaultSetSubRows = <TData extends TableData = TableData>(
	row: TData,
	subRows: TData[]
) => {
	return {
		...row,
		subRows,
	}
}
