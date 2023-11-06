import Collapse from '@mui/material/Collapse'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React, { forwardRef } from 'react'

import type { Table_Row, TableInstance } from '..'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'

interface Props {
	row: Table_Row
	table: TableInstance
}

export const TableDetailPanel = forwardRef<HTMLTableRowElement, Props>(
	({ row, table }, ref) => {
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

		const tableRowProps = getValueOrFunctionHandler(muiTableBodyRowProps)({
			isDetailPanel: true,
			row,
			table,
		})

		const tableCellProps = getValueOrFunctionHandler(muiTableDetailPanelProps)({
			row,
			table,
		})

		return (
			<TableRow
				className="Mui-TableBodyCell-DetailPanel"
				{...tableRowProps}
				ref={ref}
				sx={(theme) => ({
					display: layoutMode === 'grid' ? 'flex' : 'table-row',
					width: '100%',
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
)
