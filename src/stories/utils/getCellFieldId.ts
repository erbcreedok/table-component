import { Table_Cell, TableData } from '../../TableComponent'

export const getCellFieldId = <T extends TableData = TableData>(cell: Table_Cell<T>) => {
	return `${cell.row.id}.${cell.column.id}`
}
