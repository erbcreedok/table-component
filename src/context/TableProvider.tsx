import { ThemeProvider } from '@mui/material'
import { PropsWithChildren } from 'react'

import { useTable } from '../hooks/useTable'
import { useTableInitialization } from '../hooks/useTableInitialization'
import { TableComponentProps } from '../TableComponent'

import { TableContext, TableContextType } from './TableContext'

export const TableProvider = <TData extends Record<string, any> = {}>({
	children,
	...initialProps
}: PropsWithChildren<TableComponentProps<TData>>) => {
	const props = useTableInitialization(initialProps)

	const tableContext = useTable(props) as unknown as TableContextType<{}>

	return (
		<ThemeProvider theme={props.theme}>
			<TableContext.Provider value={tableContext}>
				{children}
			</TableContext.Provider>
		</ThemeProvider>
	)
}
