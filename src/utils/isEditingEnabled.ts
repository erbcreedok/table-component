import {
	EnableEditingArgs,
	EnableEditingOption,
	type TableData,
} from '../TableComponent'

export const isEditingEnabled = <TData extends TableData = TableData>(
	enableEditing: EnableEditingOption<TData> | undefined,
	args: EnableEditingArgs<TData>
): boolean => {
	return typeof enableEditing === 'function'
		? enableEditing(args)
		: enableEditing === true
}

export const isEditInputDisabled = <TData extends TableData = TableData>(
	enableEditing: EnableEditingOption<TData> | undefined,
	args: EnableEditingArgs<TData>
): boolean => {
	return enableEditing ? !isEditingEnabled(enableEditing, args) : false
}
