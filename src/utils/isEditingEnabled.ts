import { EnableEditingArgs, EnableEditingOption } from '../TableComponent'

export const isEditingEnabled = <TData extends Record<string, any> = {}>(
	enableEditing: EnableEditingOption<TData> | undefined,
	args: EnableEditingArgs<TData>
): boolean => {
	return typeof enableEditing === 'function'
		? enableEditing(args)
		: enableEditing !== false
}
