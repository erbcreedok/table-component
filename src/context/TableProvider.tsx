import { ThemeProvider } from '@mui/material'
import { PropsWithChildren } from 'react'
import { FormProvider } from 'react-hook-form'

import { TableFormProvider } from '../components/TableFormProvider'
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

	return (
		<ThemeProvider theme={props.theme}>
			<TableContext.Provider value={tableContext}>
				<TableFormProvider table={tableContext.table}>
					{children}
				</TableFormProvider>
			</TableContext.Provider>
		</ThemeProvider>
	)
}
