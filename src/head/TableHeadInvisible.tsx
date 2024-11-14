import { VirtualItem } from '@tanstack/react-virtual'
import React, { FC } from 'react'

import { ColumnVirtualizerWrapper } from '../'
import { getColumnWidth } from '../column.utils'
import { TableInstance } from '../TableComponent'
import { DEFAULT_EXPAND_PADDING, utilColumns } from '../utilColumns'
import { mapVirtualItems } from '../utils/virtual'

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
		getNonCollapsedLeafHeaders,
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
			<tr className="table-invisible-row">
				<ColumnVirtualizerWrapper>
					{mapVirtualItems(getNonCollapsedLeafHeaders(), virtualColumns).map(
						([header, virtualColumn]) => {
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
						}
					)}
				</ColumnVirtualizerWrapper>
			</tr>
		</thead>
	)
}
