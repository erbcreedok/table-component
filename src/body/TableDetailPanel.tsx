import Collapse from '@mui/material/Collapse'
import { lighten } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import type { VirtualItem } from '@tanstack/react-virtual'
import React, { FC } from 'react'

import type { Table_Row, TableInstance } from '..'

interface Props {
	parentRowRef: React.RefObject<HTMLTableRowElement>
	row: Table_Row
	table: TableInstance
	virtualRow?: VirtualItem
}

export const TableDetailPanel: FC<Props> = ({
	parentRowRef,
	row,
	table,
	virtualRow,
}) => {
	const {
		getVisibleLeafColumns,
		getState,
		options: {
			layoutMode,
			muiTableBodyRowProps,
			muiTableDetailPanelProps,
			renderDetailPanel,
			enableDetailedPanel,
			detailedRowBackgroundColor,
			detailPanelBorderColor,
		},
	} = table
	const { isLoading, grouping } = getState()

	const tableRowProps =
		muiTableBodyRowProps instanceof Function
			? muiTableBodyRowProps({ isDetailPanel: true, row, table })
			: muiTableBodyRowProps

	const tableCellProps =
		muiTableDetailPanelProps instanceof Function
			? muiTableDetailPanelProps({ row, table })
			: muiTableDetailPanelProps

	return (
		<TableRow
			className="Mui-TableBodyCell-DetailPanel"
			{...tableRowProps}
			sx={(theme) => ({
				display: layoutMode === 'grid' ? 'flex' : 'table-row',
				position: virtualRow ? 'absolute' : undefined,
				top: virtualRow
					? `${parentRowRef.current?.getBoundingClientRect()?.height}px`
					: undefined,
				transform: virtualRow
					? `translateY(${virtualRow?.start}px)`
					: undefined,
				width: '100%',
				zIndex: virtualRow ? 2 : undefined,
				...(tableRowProps?.sx instanceof Function
					? tableRowProps.sx(theme)
					: (tableRowProps?.sx as any)),
			})}
		>
			<TableCell
				className="Mui-TableBodyCell-DetailPanel"
				colSpan={getVisibleLeafColumns().length - grouping.length}
				{...tableCellProps}
				sx={(theme) => ({
					backgroundColor: virtualRow
						? lighten(theme.palette.background.default, 0.06)
						: undefined,
					display: layoutMode === 'grid' ? 'flex' : 'table-cell',
					borderLeft: !row?.getIsExpanded?.()
						? 'none'
						: `1px solid ${detailPanelBorderColor}`,
					borderRight: !row?.getIsExpanded?.()
						? 'none'
						: `1px solid ${detailPanelBorderColor}`,
					borderBottom: !row?.getIsExpanded?.()
						? 'none'
						: `1px solid ${detailPanelBorderColor}`,
					pb: row?.getIsExpanded?.() ? '1rem' : 0,
					pt: row?.getIsExpanded?.() ? '1rem' : 0,
					transition: 'all 150ms ease-in-out',
					width: `${table.getTotalSize()}px`,
					...(tableCellProps?.sx instanceof Function
						? tableCellProps.sx(theme)
						: (tableCellProps?.sx as any)),
					...(enableDetailedPanel && detailedRowBackgroundColor
						? { background: detailedRowBackgroundColor }
						: {}),
				})}
			>
				{renderDetailPanel && (
					<Collapse in={row?.getIsExpanded?.()} mountOnEnter unmountOnExit>
						{!isLoading && renderDetailPanel({ row, table })}
					</Collapse>
				)}
			</TableCell>
		</TableRow>
	)
}
