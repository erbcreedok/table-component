import { PropsWithChildren } from 'react'
import { FormProvider } from 'react-hook-form'

import { useTableForm } from '../hooks'
import { TableInstance } from '../TableComponent'

export type TableFormProviderProps = PropsWithChildren<{
	table: TableInstance
}>
export const TableFormProvider = ({
	table,
	children,
}: TableFormProviderProps) => {
	const {
		options: { disableFormProvider },
	} = table
	const methods = useTableForm(table)

	if (disableFormProvider) {
		return <>{children}</>
	}

	return <FormProvider {...methods}>{children}</FormProvider>
}
