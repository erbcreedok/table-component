import Box from '@mui/material/Box'

import { GroupBorders } from '../utils/getGroupBorders'

import { Colors, groupDividerBorder } from './styles'

export const EmptyCell = ({
	isGroupedCell,
	isLastGroupedColumn,
	groupBorders,
}: {
	isGroupedCell?: boolean
	isLastGroupedColumn?: boolean
	groupBorders?: GroupBorders
}) => (
	<td style={{ position: 'relative', ...groupBorders }}>
		<Box
			sx={{
				position: 'absolute',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: isGroupedCell ? Colors.Gray10 : 'transparent',
				borderTop: isGroupedCell ? 'none' : `1px solid ${Colors.Gray}`,
				borderRight: isLastGroupedColumn ? groupDividerBorder : 'none',
			}}
		/>
	</td>
)
