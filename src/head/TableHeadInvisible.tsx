import React, { FC } from 'react'
import { VirtualItem } from '@tanstack/react-virtual'

import { ColumnVirtualizerWrapper } from '../components/ColumnVirtualizerWrapper'
import { DEFAULT_EXPAND_PADDING, utilColumns } from '../utilColumns'
import { getHeadersFilteredByDisplay } from '../utils/getFilteredByDisplay'
import { getColumnWidth, getTotalRight } from '../column.utils'
import { Table_HeaderGroup, TableInstance } from '../TableComponent'
import { mapVirtualItems } from '../utils/virtual'

type TableHeadInvisibleProps = {
	measureElement?: (element: HTMLTableCellElement) => void
	table: TableInstance
	virtualColumns?: VirtualItem[]
}
export const TableHeadInvisible: FC<TableHeadInvisibleProps> = ({
	measureElement,
	table,
	virtualColumns,
}) => {
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
			{(getHeaderGroups() as Table_HeaderGroup[]).map((headerGroup) => (
				<tr key={headerGroup.id}>
					<ColumnVirtualizerWrapper>
						{mapVirtualItems(
							getHeadersFilteredByDisplay(headerGroup.headers),
							virtualColumns
						).map(([header, virtualColumn]) => {
							const colWidth = getColumnWidth({ column: header.column, header })
							const column = header.column

							return (
								<th
									key={header.id}
									ref={measureElement}
									data-index={virtualColumn?.index}
									style={{
										...colWidth,
										...(header.id === utilColumns.expand
											? {
													width:
														expandedDepth * expandPaddingSize + colWidth.width,
											  }
											: {}),
										left:
											column.getIsPinned() === 'left'
												? `${column.getStart('left')}px`
												: undefined,
										position: column.getIsPinned() ? 'sticky' : 'relative',
										right:
											column.getIsPinned() === 'right'
												? `${getTotalRight(table, column)}px`
												: undefined,
									}}
								/>
							)
						})}
					</ColumnVirtualizerWrapper>
				</tr>
			))}
		</thead>
	)
}
