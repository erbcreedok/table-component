import { TableComponentProps, TableData } from '../TableComponent'

export const isEditRowActionVisible = (editingMode?: string) => {
	return editingMode ? ['row', 'modal'].includes(editingMode) : false
}
export const showRowActionsColumn = <TData extends TableData = TableData>(
	props: TableComponentProps<TData>
) => {
	if (props.enableRowActions !== undefined) return props.enableRowActions
	if (props.enableEditing && isEditRowActionVisible(props.editingMode)) {
		if (props.renderRowActionMenuItems) return !props.hideEditRowAction

		return true
	}

	return false
}
