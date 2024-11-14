import type { TableComponentProps } from '../TableComponent'

export const showUtilityColumn = <TData>(config: TableComponentProps<TData>) =>
	config.enableRowDragging ||
	config.enableRowNumbers ||
	(!config.hideRowSelectionColumn && config.enableRowSelection)
