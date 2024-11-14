export const defaultGetSubRows = (row) => row?.subRows
export const defaultSetSubRows = <TData>(row: TData, subRows: TData[]) => {
	return {
		...row,
		subRows,
	}
}
