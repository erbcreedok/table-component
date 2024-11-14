import { createContext } from 'react'

import {
	Table_TableState,
	TableComponentPropsDefined,
	TableData,
	TableInstance,
} from '../TableComponent'

export type TableContextType<TData = TableData> = {
	table: TableInstance<TData>
	state: Table_TableState<TData>
	config: TableComponentPropsDefined<TData>
}
export const TableContext = createContext<TableContextType>(
	{} as TableContextType
)
