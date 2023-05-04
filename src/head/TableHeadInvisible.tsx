import { FC } from 'react'

import { getColumnWidth } from '../column.utils'
import { Table_HeaderGroup, TableInstance } from '../TableComponent'

type TableHeadInvisibleProps = {
	table: TableInstance
}
export const TableHeadInvisible: FC<TableHeadInvisibleProps> = ({ table }) => {
	const { getHeaderGroups } = table

	return (
		<thead>
			{(getHeaderGroups() as Table_HeaderGroup[]).map((headerGroup) => (
				<tr key={headerGroup.id}>
					{headerGroup.headers.map((header) => (
						// eslint-disable-next-line jsx-a11y/control-has-associated-label
						<th
							key={header.id}
							style={getColumnWidth({ column: header.column, header })}
						/>
					))}
				</tr>
			))}
		</thead>
	)
}
