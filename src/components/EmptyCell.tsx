import Box from '@mui/material/Box'

import { useTableContext } from '../context/useTableContext'
import { GroupBorders } from '../utils/getGroupBorders'

import { Colors } from './styles'

export const EmptyCell = ({
	isGroupedCell,
	isLastGroupedColumn,
	groupBorders,
}: {
	isGroupedCell?: boolean
	isLastGroupedColumn?: boolean
	groupBorders?: GroupBorders
}) => {
	const {
		table: {
			options: { groupDivider },
		},
	} = useTableContext()

	return (
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
					borderRight: isLastGroupedColumn ? groupDivider : 'none',
				}}
			/>
		</td>
	)
}
