import React, { FC } from 'react'
import Box from '@mui/material/Box'

import { TableInstance } from '..'
import { TextColor } from '../components/styles'

interface Props {
	table: TableInstance
	enableRowNumbers?: boolean
	hovered?: boolean
	headerElement: React.ReactNode
}

export const TableHeadCellUtility: FC<Props> = ({
	table,
	enableRowNumbers,
	hovered,
	headerElement,
}) => {
	const {
		options: {
			hideRowSelectionColumn,
			enableRowSelection,
			enableSelectAll,
			enableMultiRowSelection,
		},
	} = table

	const isAnyRowSelected = table.getSelectedRowModel().flatRows.length > 0
	const isRowNumbersOnly =
		hideRowSelectionColumn ||
		!enableRowSelection ||
		!enableSelectAll ||
		!enableMultiRowSelection

	return (
		<>
			{enableRowNumbers && (
				<>
					{!isRowNumbersOnly && (hovered || isAnyRowSelected) ? (
						headerElement
					) : (
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
							}}
						>
							#
						</Box>
					)}
				</>
			)}
			{!enableRowNumbers && headerElement}
		</>
	)
}
