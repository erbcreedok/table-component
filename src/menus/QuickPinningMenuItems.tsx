import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'

import { getTestAttributes } from '../utils/getTestAttributes'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

export const QuickPinningMenuItems = ({ column, table, setVisible }) => {
	const {
		options: {
			enablePinning,
			icons: { PushPinIcon },
			localization,
			test,
		},
	} = table

	const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
		column.pin(pinDirection)
		setVisible(false)
	}

	return (
		<>
			{enablePinning &&
				column.getCanPin() && [
					<MenuItem
						disabled={column.getIsPinned() === 'left' || !column.getCanPin()}
						key={0}
						onClick={() => handlePinColumn('left')}
						sx={commonMenuItemStyles}
						{...getTestAttributes(test, 'columnMenuPin')}
					>
						<Box sx={commonListItemStyles}>
							<ListItemIcon>
								<PushPinIcon style={{ transform: 'rotate(90deg)' }} />
							</ListItemIcon>
							{localization.pinToLeft}
						</Box>
					</MenuItem>,
					<MenuItem
						disabled={column.getIsPinned() === 'right' || !column.getCanPin()}
						key={1}
						onClick={() => handlePinColumn('right')}
						sx={commonMenuItemStyles}
					>
						<Box sx={commonListItemStyles}>
							<ListItemIcon>
								<PushPinIcon style={{ transform: 'rotate(-90deg)' }} />
							</ListItemIcon>
							{localization.pinToRight}
						</Box>
					</MenuItem>,
					<MenuItem
						disabled={!column.getIsPinned()}
						key={2}
						onClick={() => handlePinColumn(false)}
						sx={commonMenuItemStyles}
					>
						<Box sx={commonListItemStyles}>
							<ListItemIcon>
								<PushPinIcon />
							</ListItemIcon>
							{localization.unpin}
						</Box>
					</MenuItem>,
				]}
		</>
	)
}
