import MuiTableCell from '@mui/material/TableCell'
import React from 'react'

import { Colors } from '../components/styles'
import { getColorAlpha } from '../utils/getColorAlpha'

interface Props {
	colSpan: number
	enableHover?: boolean
}

export const TableBodyCellEmpty = ({ enableHover, colSpan }: Props) => {
	return (
		<MuiTableCell
			colSpan={colSpan}
			sx={() => ({
				alignItems: undefined,
				cursor: 'inherit',
				height: '47px',
				boxSizing: 'content-box',
				overflow: 'hidden',
				verticalAlign: 'middle',
				position: 'relative',
				p: '0',
				px: 0,
				pl: undefined,
				textOverflow: undefined,
				whiteSpace: 'normal',
				zIndex: 0,
				'&:hover': {
					backgroundColor: enableHover
						? `${getColorAlpha(Colors.Gray90, 0.05)} !important`
						: undefined,
					'& > div > button': {
						visibility: 'visible',
					},
				},
				borderBottom: `1px solid ${Colors.Gray20}`,
			})}
		/>
	)
}
