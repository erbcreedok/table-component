import React, { FC } from 'react'
import { VirtualItem } from '@tanstack/react-virtual'

import { ColumnVirtualizerWrapper } from '../components/ColumnVirtualizerWrapper'
import { DEFAULT_EXPAND_PADDING, utilColumns } from '../utilColumns'
import { getColumnWidth } from '../column.utils'
import { TableInstance } from '../TableComponent'
import { getHeadersFilteredByDisplay } from '../utils/getFilteredByDisplay'
import { sortMappedVirtualHeaders } from '../utils/sortColumns'
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
		options: {
			expandPaddingSize = DEFAULT_EXPAND_PADDING,
			getPinnedColumnPosition,
		},
	} = table
	const expandedDepth = getPaginationRowModel().rows.reduce(
		(max, row) => Math.max(row.depth, max),
		0
	)

	return (
		<thead>
			{getHeaderGroups().map((headerGroup) => (
				<tr key={headerGroup.id}>
					<ColumnVirtualizerWrapper>
						{sortMappedVirtualHeaders(
							mapVirtualItems(
								getHeadersFilteredByDisplay(headerGroup.headers),
								virtualColumns
							)
						).map(([header, virtualColumn]) => {
							const colWidth = getColumnWidth({ column: header.column, header })
							const column = header.column

							return (
								<th
									key={header.id}
									ref={measureElement}
									data-index={virtualColumn?.index}
									data-header={column.header}
									data-column-id={column.id}
									style={{
										...colWidth,
										...(header.id === utilColumns.expand
											? {
													width:
														expandedDepth * expandPaddingSize + colWidth.width,
											  }
											: {}),
										position: column.getIsPinned() ? 'sticky' : 'relative',
										...getPinnedColumnPosition?.(column, table),
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
