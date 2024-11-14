import { ThemeProvider } from '@mui/material'
import { PropsWithChildren } from 'react'
import { FormProvider } from 'react-hook-form'

import { useTableForm, useTableWithFormMethods } from '../hooks'
import { useTable } from '../hooks/useTable'
import { useTableInitialization } from '../hooks/useTableInitialization'
import { TableComponentProps } from '../TableComponent'

import { TableContext, TableContextType } from './TableContext'

export const TableProvider = ({
	children,
	...initialProps
}: PropsWithChildren<TableComponentProps>) => {
	const props = useTableInitialization(initialProps)

	const tableContext = useTable(props) as unknown as TableContextType
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
