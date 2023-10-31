import { FC } from 'react'

import { DEFAULT_EXPAND_PADDING, utilColumns } from '../utilColumns'
import { getHeaderGroupFilteredByDisplay } from '../utils/getFilteredByDisplay'
import { getColumnWidth } from '../column.utils'
import { Table_HeaderGroup, TableInstance } from '../TableComponent'

type TableHeadInvisibleProps = {
	table: TableInstance
}
export const TableHeadInvisible: FC<TableHeadInvisibleProps> = ({ table }) => {
	const {
		getHeaderGroups,
		getPaginationRowModel,
		options: { expandPaddingSize = DEFAULT_EXPAND_PADDING },
	} = table
	const expandedDepth = getPaginationRowModel().rows.reduce(
		(max, row) => Math.max(row.depth, max),
		0
	)

	return (
		<thead>
			{(getHeaderGroups() as Table_HeaderGroup[]).map((headerGroup) => {
				const filteredHeaderGroup = getHeaderGroupFilteredByDisplay(headerGroup)

				return (
					<tr key={filteredHeaderGroup.id}>
						{filteredHeaderGroup.headers.map((header) => {
							const colWidth = getColumnWidth({ column: header.column, header })

							return (
								// eslint-disable-next-line jsx-a11y/control-has-associated-label
								<th
									key={header.id}
									style={{
										...colWidth,
										...(header.id === utilColumns.expand
											? {
													width:
														expandedDepth * expandPaddingSize + colWidth.width,
											  }
											: {}),
									}}
								/>
							)
						})}
					</tr>
				)
			})}
		</thead>
	)
}
