import { ThemeProvider } from '@mui/material'
import { PropsWithChildren } from 'react'
import { FormProvider } from 'react-hook-form'

import { useTable } from '../hooks/useTable'
import { useTableInitialization } from '../hooks/useTableInitialization'
import { TableComponentProps } from '../TableComponent'
import { useTableForm, useTableWithFormMethods } from '../hooks'

import { TableContext, TableContextType } from './TableContext'

export const TableProvider = <TData extends Record<string, any> = {}>({
	children,
	...initialProps
}: PropsWithChildren<TableComponentProps<TData>>) => {
	const props = useTableInitialization(initialProps)

	const tableContext = useTable(props) as unknown as TableContextType<{}>
	useTableWithFormMethods(tableContext.table)
	const methods = useTableForm(tableContext.table)

	return (
		<ThemeProvider theme={props.theme}>
			<TableContext.Provider value={tableContext}>
				<FormProvider {...methods}>{children}</FormProvider>
			</TableContext.Provider>
		</ThemeProvider>
	)
}
