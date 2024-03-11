import type { TableComponentProps, TableData } from '../TableComponent'

export const showUtilityColumn = <TData extends TableData = TableData>(
	config: TableComponentProps<TData>
) =>
	config.enableRowDragging ||
	config.enableRowNumbers ||
	(!config.hideRowSelectionColumn && config.enableRowSelection)
