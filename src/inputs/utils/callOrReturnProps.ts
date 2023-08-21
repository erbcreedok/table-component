import { TableCellDataProps, TableData } from '../../TableComponent'

export const callOrReturnProps = <TData extends TableData>(
	func: unknown,
	args: TableCellDataProps<TData>
) => {
	return func instanceof Function ? func(args) : func
}
