import { BoxProps } from '@mui/material'
import Box from '@mui/material/Box'
import { HTMLProps } from 'react'

import { GroupBorders } from '../utils/getGroupBorders'
import { mergeSx } from '../utils/mergeSx'

import { Colors, groupDividerBorder } from './styles'

export type EmptyCellProps = {
	isGroupedCell?: boolean
	isLastGroupedColumn?: boolean
	groupBorders?: GroupBorders
	wrapperProps?: BoxProps
} & HTMLProps<HTMLTableCellElement>
export const EmptyCell = ({
	isGroupedCell,
	isLastGroupedColumn,
	groupBorders,
	wrapperProps,
	...rest
}: EmptyCellProps) => (
	<td
		{...rest}
		style={{ position: 'relative', ...groupBorders, ...rest.style }}
	>
		<Box
			{...wrapperProps}
			sx={mergeSx(
				{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: isGroupedCell ? Colors.Gray10 : 'transparent',
					borderTop: isGroupedCell ? 'none' : `1px solid ${Colors.Gray}`,
					borderRight: isLastGroupedColumn ? groupDividerBorder : 'none',
				},
				wrapperProps?.sx
			)}
		/>
	</td>
)
