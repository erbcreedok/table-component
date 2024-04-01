import React, { FC, RefObject } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

import { Table_Cell, TableInstance } from '..'
import { TextColor } from '../components/styles'
import { getIsMockRow } from '../utils/getIsMockRow'

import { TableBodyRowGrabHandle } from './TableBodyRowGrabHandle'

interface Props {
	cell: Table_Cell
	table: TableInstance
	rowRef: RefObject<HTMLTableRowElement>
	rowNumber: number
	isDraggableCell?: boolean
	isCurrentRowSelected?: boolean
	enableRowNumbers?: boolean
}

export const TableBodyCellUtility: FC<Props> = ({
	cell,
	table,
	isDraggableCell,
	isCurrentRowSelected,
	rowRef,
	rowNumber,
	enableRowNumbers,
}) => {
	const {
		options: {
			hideRowSelectionColumn,
			enableRowSelection,
			enableSelectAll,
			enableMultiRowSelection,
		},
	} = table
	const { column, row } = cell
	const { columnDef } = column

	if (table.getIsNewRow(row)) return null

	const isMock = getIsMockRow(row)
	const isRowNumbersOnly =
		isMock ||
		hideRowSelectionColumn ||
		!enableRowSelection ||
		!enableSelectAll ||
		!enableMultiRowSelection

	const trimRowNumber = rowNumber >= 1000

	return (
		<>
			{enableRowNumbers && (
				<Tooltip
					arrow
					enterDelay={1000}
					enterNextDelay={1000}
					title={rowNumber}
					disableHoverListener={!trimRowNumber}
				>
					<Box
						sx={{
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							color: TextColor.Disabled,
							fontSize: '12px',
							fontWeight: 600,
							lineHeight: '18px',
							maxWidth: '26px',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: trimRowNumber ? 'ellipsis' : 'clip',
							visibility: !isCurrentRowSelected ? 'visible' : 'hidden',
							'tr:hover &': {
								visibility: isRowNumbersOnly ? 'visible' : 'hidden',
							},
						}}
					>
						{rowNumber}
					</Box>
				</Tooltip>
			)}
			{isDraggableCell && !isMock ? (
				<TableBodyRowGrabHandle
					cell={cell}
					rowRef={rowRef}
					table={table}
					sx={{
						visibility: isCurrentRowSelected ? 'visible' : 'hidden',
						'tr:hover &': {
							visibility: 'visible',
						},
					}}
				/>
			) : (
				<Box sx={{ width: '9px' }} />
			)}
			{columnDef.Cell?.({ cell, column, row, table })}
		</>
	)
}
