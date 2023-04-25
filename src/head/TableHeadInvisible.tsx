import { FC } from 'react'

import { TableInstance } from '../TableComponent'

type TableHeadInvisibleProps = {
	table: TableInstance
}
export const TableHeadInvisible: FC<TableHeadInvisibleProps> = ({ table }) => {
	const { getHeaderGroups } = table

	return (
		<thead>
			{getHeaderGroups().map((headerGroup) => (
				<tr key={headerGroup.id}>
					{headerGroup.headers.map((column) => (
						// eslint-disable-next-line jsx-a11y/control-has-associated-label
						<th key={column.id} style={{ width: column.getSize() }} />
					))}
				</tr>
			))}
		</thead>
	)
}
