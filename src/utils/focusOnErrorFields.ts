import { UseFormReturn } from 'react-hook-form'

import { TableData, TableInstance } from '../TableComponent'

export const focusOnErrorFields = <TData extends TableData = {}>(props: {
	table: TableInstance<TData>
	methods: UseFormReturn<any>
}) => {
	const { table, methods } = props
	const { formState } = methods

	return Object.entries(formState.errors).some(([rowId, errors]) => {
		if (typeof errors !== 'object') return false
		const columnId = Object.keys(errors)[0]
		const row = table.getRow(rowId)
		if (!rowId || !row || !columnId) {
			return false
		}
		row.showInTable()
		const fieldId = `${rowId}.${columnId}`

		table.setEditingRow(row)
		queueMicrotask(() => {
			const field = table.refs.editInputRefs.current[fieldId]
			if (field) {
				field.focus()
			}
		})

		return true
	})
}
