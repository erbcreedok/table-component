import { Table_Cell } from '../'

export const getCellFieldId = <T = {}>(cell: Table_Cell<T>) => {
	return `${cell.row.id}.${cell.column.id}`
}
