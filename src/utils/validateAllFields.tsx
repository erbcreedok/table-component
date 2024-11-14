import { UseFormReturn } from 'react-hook-form'

import { TableData, TableInstance } from '../TableComponent'

import { focusOnErrorFields } from './focusOnErrorFields'
import { getCellFieldId } from './getCellFieldId'
import { getDirtyFieldsIds } from './getDirtyFields'

export type ValidateAllFieldsProps<TData = TableData> = {
	table: TableInstance<TData>
	methods: UseFormReturn<any>
	focusOnErrorFields?: boolean
	allowHiddenRequiredColumns?: boolean
	fieldsToValidate?: string[]
}
const getErrorMessage = (error?: boolean | string) => {
	if (typeof error === 'string') return error
	if (error === false) return 'Error'

	return null
}

// we can't use default use-hook-form trigger method,
// because it doesn't validate unmounted rows and cells.
// So we need to validate all fields manually.
export const validateAllFields = async (props: ValidateAllFieldsProps) => {
	const {
		table,
		methods,
		focusOnErrorFields: _focusOnErrorFields = true,
		allowHiddenRequiredColumns = false,
		fieldsToValidate,
	} = props
	const {
		options: {
			localization: { fieldNameIsRequired, requiredFieldIsHidden },
		},
	} = table
	let isValid = true
	table.getCoreRowModel().flatRows.forEach((row) => {
		row.getAllCells().forEach((cell) => {
			const fieldId = getCellFieldId(cell)
			if (fieldsToValidate && !fieldsToValidate.includes(fieldId)) {
				return
			}
			const { column } = cell
			const { validator, required } = column.columnDef
			const requiredError =
				required && !methods.getValues(fieldId)
					? fieldNameIsRequired?.replace('{column}', String(column.header))
					: undefined
			if (requiredError) {
				isValid = false
				methods.setError(fieldId, {
					type: 'required',
					message: requiredError,
				})
				if (!allowHiddenRequiredColumns && !column.getIsVisible()) {
					table.setEditingRow(row)
					methods.setError(row.id, {
						type: 'required',
						message: requiredFieldIsHidden,
					})
				}

				return
			}
			const validateMessage = getErrorMessage(
				validator?.({
					value: methods.getValues(fieldId),
					values: methods.getValues(),
					table,
					row,
					cell,
				})
			)
			if (validateMessage) {
				isValid = false
				methods.setError(fieldId, {
					type: 'validate',
					message: validateMessage,
				})
			}
		})
	})

	if (!isValid && _focusOnErrorFields) {
		focusOnErrorFields({ table, methods })
	}

	return isValid
}

export const validateDirtyFields = async (props: ValidateAllFieldsProps) => {
	return validateAllFields({
		...props,
		fieldsToValidate: getDirtyFieldsIds(props.methods),
	})
}
