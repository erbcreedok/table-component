import { UseFormReturn } from 'react-hook-form'

import { TableData, TableInstance } from '../TableComponent'

import { focusOnErrorFields } from './focusOnErrorFields'
import { getDirtyFieldsIds } from './getDirtyFields'

export type ValidateAllFieldsProps<TData extends TableData = {}> = {
	table: TableInstance<TData>
	methods: UseFormReturn<any>
	focusOnErrorFields?: boolean
	fieldsToValidate?: string[]
}
export const validateAllFields = async <TData extends TableData = {}>(
	props: ValidateAllFieldsProps<TData>
) => {
	const {
		table,
		methods,
		focusOnErrorFields: _focusOnErrorFields = true,
		fieldsToValidate,
	} = props
	const { trigger } = methods

	return trigger(fieldsToValidate).then((isValid) => {
		if (!isValid && _focusOnErrorFields) {
			focusOnErrorFields({ table, methods })
		}

		return isValid
	})
}

export const validateDirtyFields = async <TData extends TableData = {}>(
	props: ValidateAllFieldsProps<TData>
) => {
	return validateAllFields({
		...props,
		fieldsToValidate: getDirtyFieldsIds(props.methods),
	})
}
