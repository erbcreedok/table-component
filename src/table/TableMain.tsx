import { useTableContext } from '../context/useTableContext'

import { TableRoot } from './TableRoot'

export const TableMain = () => {
	const tableContext = useTableContext()

	return <TableRoot {...tableContext} />
}
