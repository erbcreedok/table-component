import { TableFeature } from '@tanstack/table-core'

import { Table_ColumnDef } from '../TableComponent'

export const notDisplayedColumnFeature: TableFeature = {
	getDefaultColumnDef() {
		return { meta: { notDisplayed: false } }
	},
	createColumn(column, table) {
		const columnDef = column.columnDef as Table_ColumnDef
		const notDisplayed =
			columnDef.notDisplayed || column.columnDef.meta?.notDisplayed
		column.getIsVisible = () => {
			return (
				(!notDisplayed && table.getState().columnVisibility?.[column.id]) ??
				true
			)
		}
	},
}
