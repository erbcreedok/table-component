import React, { FC, useRef } from 'react'
import TableCell from '@mui/material/TableCell'

import type { MultirowColumn, TableInstance } from '..'

import { TableHeadMultiRowCellActions } from './TableHeadMultiRowCellActions'

type Props = {
	cell: MultirowColumn
	cellStyles: Record<string, any>
	table: TableInstance
	multirowColumnsDisplayDepth: number
}

export const TableHeadMultiRowCell: FC<Props> = ({
	cell,
	cellStyles,
	table,
	multirowColumnsDisplayDepth,
}) => {
	const localRef = useRef<HTMLTableCellElement>(null)

	return (
		<TableHeadMultiRowCellActions
			key={cell.id}
			anchorElRef={localRef}
			table={table}
			actions={cell.multirowColumnActions}
			cell={cell}
			multirowColumnsDisplayDepth={multirowColumnsDisplayDepth}
		>
			{({ onClick }) => (
				<TableCell
					onClick={onClick}
					ref={localRef}
					sx={{
						...cellStyles,
						...(cell.isPinned
							? {
									position: 'sticky',
									left: cell.leftPinnedPosition,
									right: cell.rightPinnedPosition,
									zIndex: 3,
							  }
							: {}),
						cursor:
							cell.multirowColumnActions &&
							multirowColumnsDisplayDepth === cell.depth
								? 'pointer'
								: undefined,
					}}
					colSpan={cell.colSpan}
				>
					{cell.text}
				</TableCell>
			)}
		</TableHeadMultiRowCellActions>
	)
}
