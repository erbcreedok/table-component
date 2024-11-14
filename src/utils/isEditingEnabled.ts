import { EnableEditingArgs, EnableEditingOption } from '../TableComponent'

export const isEditingEnabled = <TData>(
	enableEditing: EnableEditingOption<TData> | undefined,
	args: EnableEditingArgs<TData>
): boolean => {
	return typeof enableEditing === 'function'
		? enableEditing(args)
		: enableEditing === true
}

export const isEditInputDisabled = <TData>(
	enableEditing: EnableEditingOption<TData> | undefined,
	args: EnableEditingArgs<TData>
): boolean => {
	return enableEditing ? !isEditingEnabled(enableEditing, args) : false
}
