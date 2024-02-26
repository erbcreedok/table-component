import React, { FC } from 'react'
import { VirtualItem } from '@tanstack/react-virtual'

import { ColumnVirtualizerWrapper } from '../components/ColumnVirtualizerWrapper'
import { DEFAULT_EXPAND_PADDING, utilColumns } from '../utilColumns'
import { getColumnWidth } from '../column.utils'
import { TableInstance } from '../TableComponent'
import { getHeadersFilteredByDisplay } from '../utils/getFilteredByDisplay'
import { sortMappedVirtualHeaders } from '../utils/sortColumns'
import { mapVirtualItems } from '../utils/virtual'
import { getNonCollapsedColumns } from '../utils/getNonCollapsedColumns'

type TableHeadInvisibleProps = {
	measureElement?: (element: HTMLTableCellElement) => void
	table: TableInstance
	virtualColumns?: VirtualItem[]
}

const EMPTY_TABLE_HEAD_WIDTH = 180

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
		getState,
	} = table
	const { collapsedMultirow } = getState()
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
								getNonCollapsedColumns(
									getHeadersFilteredByDisplay(headerGroup.headers),
									collapsedMultirow
								),
								virtualColumns
							)
						).map(([header, virtualColumn]) => {
							if (header.empty) {
								return (
									<th
										key={header.keyName}
										ref={measureElement}
										data-index={virtualColumn?.index}
										style={{
											width: `${EMPTY_TABLE_HEAD_WIDTH}px`,
											maxWidth: `${EMPTY_TABLE_HEAD_WIDTH}px`,
											position: 'relative',
										}}
									/>
								)
							}

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
